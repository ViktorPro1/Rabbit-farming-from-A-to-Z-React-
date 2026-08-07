import { writeFileSync } from "node:fs";
import { groups } from "../src/data/sectionCards/index.ts";

const pathToSection: Record<string, string> = {};
const lightCards: { icon: string; title: string; path: string }[] = [];

for (const group of groups) {
    for (const card of group.cards) {
        if (!card.external) {
            pathToSection[card.path] = group.groupTitle;
        }
        if (group.groupTitle !== "Статті") {
            lightCards.push({
                icon: card.icon,
                title: card.title,
                path: card.path,
            });
        }
    }
}

const output = `// Автогенеровано скриптом scripts/generate-nav-map.ts — не редагувати вручну.
export const PATH_TO_SECTION: Record<string, string> = ${JSON.stringify(pathToSection, null, 2)};

export interface LightCard {
  icon: string;
  title: string;
  path: string;
}

export const LIGHT_CARDS: LightCard[] = ${JSON.stringify(lightCards, null, 2)};
`;

writeFileSync("./src/data/navMap.generated.ts", output);
console.log(
    `✓ navMap.generated.ts: ${Object.keys(pathToSection).length} шляхів, ${lightCards.length} карток`,
);