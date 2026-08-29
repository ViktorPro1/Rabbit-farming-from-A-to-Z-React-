import { supabase, sendToUser } from './push';
import { addDays } from './dates';

const WEANING_SCHEME_DAYS: Record<string, number> = {
    intensive: 28,
    semi_intensive: 45,
    extensive: 60,
};

type CheckResult = { sent: number; error?: string };

// 1. Контрольна злучка завтра (перша злучка, таблиця matings)
export async function checkControlMatings(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('matings')
        .select('user_id, female_cage, male_cage')
        .eq('control_date', tomorrow)
        .eq('is_archived', false);

    if (error) {
        console.error('[daily-reminders] controlMatings query failed:', error);
        return { sent: 0, error: 'controlMatings' };
    }

    for (const m of data ?? []) {
        await sendToUser(
            m.user_id,
            '🐇 Контрольна злучка завтра',
            `Клітка ${m.female_cage || '?'} × ${m.male_cage || '?'} — перевір завтра.`,
            '/matings'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 2. Очікуваний окріл завтра (перша злучка, таблиця matings)
export async function checkExpectedBirths(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('matings')
        .select('user_id, female_cage')
        .eq('expected_birth', tomorrow)
        .eq('is_archived', false);

    if (error) {
        console.error('[daily-reminders] expectedBirths query failed:', error);
        return { sent: 0, error: 'expectedBirths' };
    }

    for (const m of data ?? []) {
        await sendToUser(
            m.user_id,
            '🐰 Очікуваний окріл завтра',
            `Клітка ${m.female_cage || '?'} — готуй гніздо.`,
            '/matings'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 3. Повторна контрольна злучка завтра (після попереднього окролу, таблиця litters)
export async function checkRepeatControls(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('litters')
        .select('user_id, mother_id')
        .eq('litter_control_date', tomorrow);

    if (error) {
        console.error('[daily-reminders] repeatControls query failed:', error);
        return { sent: 0, error: 'repeatControls' };
    }

    for (const l of data ?? []) {
        await sendToUser(
            l.user_id,
            '🐇 Контрольна злучка завтра (повторна)',
            'Перевір самку — контрольна дата повторної злучки.',
            '/matings'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 4. Повторний очікуваний окріл завтра (таблиця litters)
export async function checkRepeatBirths(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('litters')
        .select('user_id')
        .eq('litter_expected_birth', tomorrow);

    if (error) {
        console.error('[daily-reminders] repeatBirths query failed:', error);
        return { sent: 0, error: 'repeatBirths' };
    }

    for (const l of data ?? []) {
        await sendToUser(
            l.user_id,
            '🐰 Очікуваний окріл завтра (повторний)',
            'Готуй гніздо — очікується повторний окріл.',
            '/matings'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 5. Підготовка маточника завтра (litter_mating_date + 26 днів, ще не поставлений і окролу ще немає)
export async function checkNestboxPrep(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('litters')
        .select('user_id, litter_mating_date, mating_id')
        .is('birth_date', null)
        .is('nestbox_date', null)
        .not('litter_mating_date', 'is', null);

    if (error) {
        console.error('[daily-reminders] nestboxCandidates query failed:', error);
        return { sent: 0, error: 'nestboxCandidates' };
    }

    let sent = 0;
    for (const l of data ?? []) {
        if (addDays(l.litter_mating_date, 26) === tomorrow) {
            await sendToUser(
                l.user_id,
                '📥 Підготувати маточник завтра',
                'Окріл наближається — час поставити маточник.',
                '/matings'
            );
            sent++;
        }
    }
    return { sent };
}

// 6. Відлучення завтра (birth_date + дні за схемою злучування, ще не відлучено)
export async function checkWeaning(tomorrow: string): Promise<CheckResult> {
    const { data: candidates, error } = await supabase
        .from('litters')
        .select('user_id, birth_date, mating_id')
        .not('birth_date', 'is', null)
        .is('weaned_date', null);

    if (error) {
        console.error('[daily-reminders] weaningCandidates query failed:', error);
        return { sent: 0, error: 'weaningCandidates' };
    }

    const matingIds = [...new Set((candidates ?? []).map((l) => l.mating_id).filter(Boolean))];
    const schemeByMatingId: Record<string, string> = {};

    if (matingIds.length > 0) {
        const { data: matingsForScheme, error: schemeError } = await supabase
            .from('matings')
            .select('id, breeding_scheme')
            .in('id', matingIds);

        if (schemeError) {
            console.error('[daily-reminders] matingsForScheme query failed:', schemeError);
            // Продовжуємо з дефолтною схемою нижче, окрему помилку не рахуємо як провал усієї перевірки
        }

        (matingsForScheme ?? []).forEach((m) => {
            schemeByMatingId[m.id] = m.breeding_scheme || 'extensive';
        });
    }

    let sent = 0;
    for (const l of candidates ?? []) {
        const scheme = schemeByMatingId[l.mating_id] || 'extensive';
        const weaningDays = WEANING_SCHEME_DAYS[scheme] ?? WEANING_SCHEME_DAYS.extensive;
        if (addDays(l.birth_date, weaningDays) === tomorrow) {
            await sendToUser(
                l.user_id,
                '✂️ Відлучення завтра',
                'Крільченята готові до відлучення від матки.',
                '/matings'
            );
            sent++;
        }
    }
    return { sent };
}

// 7. Забій завтра (клітки відгодівлі, planned slaughter_date)
export async function checkSlaughter(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('fattening')
        .select('user_id, cage_number, breed')
        .eq('slaughter_date', tomorrow)
        .eq('is_active', true);

    if (error) {
        console.error('[daily-reminders] slaughterCages query failed:', error);
        return { sent: 0, error: 'slaughterCages' };
    }

    for (const c of data ?? []) {
        await sendToUser(
            c.user_id,
            '🔪 Забій завтра',
            `Клітка ${c.cage_number || '?'}${c.breed ? ` — ${c.breed}` : ''} — планова дата забою.`,
            '/fattening'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 8. Лікування — наступний прийом препарату завтра
export async function checkTreatments(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('treatments')
        .select('user_id, cage_number, drug_name')
        .eq('next_date', tomorrow);

    if (error) {
        console.error('[daily-reminders] treatmentsDue query failed:', error);
        return { sent: 0, error: 'treatmentsDue' };
    }

    for (const t of data ?? []) {
        await sendToUser(
            t.user_id,
            '💊 Лікування завтра',
            `Клітка ${t.cage_number || '?'} — ${t.drug_name || 'наступний прийом препарату'}.`,
            '/my-treatments'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 9. Вакцинація завтра
export async function checkVaccinations(tomorrow: string): Promise<CheckResult> {
    const { data, error } = await supabase
        .from('vaccinations')
        .select('user_id, cage_number, vaccine_name')
        .eq('next_date', tomorrow);

    if (error) {
        console.error('[daily-reminders] vaccinations query failed:', error);
        return { sent: 0, error: 'vaccinations' };
    }

    for (const v of data ?? []) {
        await sendToUser(
            v.user_id,
            '💉 Вакцинація завтра',
            `Клітка ${v.cage_number || '?'} — ${v.vaccine_name || 'щеплення'}.`,
            '/my-vaccinations'
        );
    }
    return { sent: data?.length ?? 0 };
}

// 10. Нагадування про зважування (reminder_days на rabbits/fattening,
// відлік від дати останнього зважування — та сама логіка, що й у
// loadCalendarEvents.ts / ReminderBadge на сторінці "Зважування")
export async function checkWeighing(tomorrow: string): Promise<CheckResult> {
    const { data: reminderRabbits, error: rabbitsError } = await supabase
        .from('rabbits')
        .select('id, name, cage_number, user_id, reminder_days')
        .eq('is_active', true)
        .not('reminder_days', 'is', null);

    if (rabbitsError) {
        console.error('[daily-reminders] reminderRabbits query failed:', rabbitsError);
        return { sent: 0, error: 'reminderRabbits' };
    }

    const { data: reminderFattening, error: fatteningError } = await supabase
        .from('fattening')
        .select('id, cage_number, user_id, reminder_days')
        .eq('is_active', true)
        .not('reminder_days', 'is', null);

    if (fatteningError) {
        console.error('[daily-reminders] reminderFattening query failed:', fatteningError);
        return { sent: 0, error: 'reminderFattening' };
    }

    if ((reminderRabbits?.length ?? 0) === 0 && (reminderFattening?.length ?? 0) === 0) {
        return { sent: 0 };
    }

    // Останнє зважування по кожному кролику/клітці відгодівлі — без фільтра
    // по даті, як і в loadCalendarEvents, бо тут важлива саме найновіша дата
    const { data: weighings, error: weighingsError } = await supabase
        .from('weighings')
        .select('weighing_date, rabbit_id, fattening_id');

    if (weighingsError) {
        console.error('[daily-reminders] weighings query failed:', weighingsError);
        return { sent: 0, error: 'weighings' };
    }

    const lastWeighingByRabbit = new Map<string, string>();
    const lastWeighingByFattening = new Map<string, string>();

    (weighings ?? []).forEach((w) => {
        if (w.rabbit_id) {
            const prev = lastWeighingByRabbit.get(w.rabbit_id);
            if (!prev || w.weighing_date > prev) lastWeighingByRabbit.set(w.rabbit_id, w.weighing_date);
        } else if (w.fattening_id) {
            const prev = lastWeighingByFattening.get(w.fattening_id);
            if (!prev || w.weighing_date > prev) lastWeighingByFattening.set(w.fattening_id, w.weighing_date);
        }
    });

    let sent = 0;

    for (const r of reminderRabbits ?? []) {
        const lastDate = lastWeighingByRabbit.get(r.id);
        if (!lastDate || !r.reminder_days) continue;
        if (addDays(lastDate, r.reminder_days) === tomorrow) {
            const subject = r.cage_number ? `${r.name} (кл.${r.cage_number})` : r.name;
            await sendToUser(
                r.user_id,
                '🔔 Час зважити',
                `${subject} — час чергового зважування.`,
                '/weighing'
            );
            sent++;
        }
    }

    for (const f of reminderFattening ?? []) {
        const lastDate = lastWeighingByFattening.get(f.id);
        if (!lastDate || !f.reminder_days) continue;
        if (addDays(lastDate, f.reminder_days) === tomorrow) {
            await sendToUser(
                f.user_id,
                '🔔 Час зважити',
                `Клітка ${f.cage_number || '?'} — час чергового зважування.`,
                '/weighing'
            );
            sent++;
        }
    }

    return { sent };
}

export const ALL_CHECKS: Array<(tomorrow: string) => Promise<CheckResult>> = [
    checkControlMatings,
    checkExpectedBirths,
    checkRepeatControls,
    checkRepeatBirths,
    checkNestboxPrep,
    checkWeaning,
    checkSlaughter,
    checkTreatments,
    checkVaccinations,
    checkWeighing,
];
