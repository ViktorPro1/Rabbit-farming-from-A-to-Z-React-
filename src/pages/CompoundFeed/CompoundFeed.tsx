import { useState } from "react";
import { Link } from "react-router-dom";
import "./CompoundFeed.css";

type TabId = "basics" | "types" | "composition" | "nutrients" | "norms" | "diy";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "basics", icon: "📖", label: "Що таке комбікорм" },
  { id: "types", icon: "🏷️", label: "Типи та маркування" },
  { id: "composition", icon: "🧪", label: "Склад" },
  { id: "nutrients", icon: "⚗️", label: "Протеїн і клітковина" },
  { id: "norms", icon: "⚖️", label: "Норми годівлі" },
  { id: "diy", icon: "🌾", label: "Своїми руками" },
];

const CompoundFeed = () => {
  const [activeTab, setActiveTab] = useState<TabId>("basics");

  return (
    <main className="cf-page">
      <div className="cf-header">
        <h1>🌾 Комбікорм для кролів</h1>
        <p>Гранула, ПК, старт, фініш, склад — від А до Я</p>
      </div>

      <div className="cf-wrap">
        <div className="cf-banner">
          <span>💡</span>
          <div>
            Комбікорм — це не замінник сіна. Це концентрована добавка до
            основного раціону, яка забезпечує кроля точним набором поживних
            речовин. Сіно в необмеженій кількості — завжди, незалежно від типу
            комбікорму.
          </div>
        </div>

        <div className="cf-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`cf-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ЩО ТАКЕ КОМБІКОРМ ── */}
        {activeTab === "basics" && (
          <div className="cf-content">
            <div className="cf-note">
              <p>
                Комбікорм (комбінований корм) — це суміш зернових, білкових,
                мінеральних і вітамінних компонентів, підібрана у точних
                пропорціях під конкретний вид тварини і фазу її життя. На
                відміну від простої зернової суміші, повнораціонний комбікорм не
                потребує додаткових добавок — він вже збалансований.
              </p>
            </div>

            <h3 className="cf-sub-title">Форми випуску</h3>
            <div className="cf-cards-grid">
              <div className="cf-card">
                <span className="cf-card-icon">⬤</span>
                <div>
                  <span className="cf-card-title">Гранула</span>
                  <p>
                    Найпоширеніша форма. Усі компоненти подрібнені, змішані і
                    спресовані під тиском і температурою у циліндричні гранули
                    діаметром 3–5 мм. Переваги: рівномірний склад у кожній
                    гранулі, кроль не вибирає «смачніше», менше відходів, довше
                    зберігається. Гранула виробляється на грануляторі з
                    матрицею.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🌀</span>
                <div>
                  <span className="cf-card-title">Розсипний (розсип)</span>
                  <p>
                    Суміш подрібнених компонентів без пресування. Дешевший у
                    виробництві, але має суттєвий недолік: кроль вибирає
                    улюблені компоненти і залишає менш смачні. Результат —
                    незбалансоване споживання. Менш популярний у промисловому
                    кролівництві.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🔵</span>
                <div>
                  <span className="cf-card-title">Екструдований</span>
                  <p>
                    Виготовляється методом екструзії — під дуже високою
                    температурою і тиском. Крохмаль желатинізується, що підвищує
                    засвоюваність. Стерильний — всі патогени знищені. Добре
                    підходить для молодняку і ослаблених тварин. Дорожчий за
                    звичайну гранулу.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🌿</span>
                <div>
                  <span className="cf-card-title">Трав'яні гранули</span>
                  <p>
                    Окремий продукт — гранули з висушеної і подрібненої люцерни,
                    тимофіївки або інших трав. Не є повноцінним комбікормом — це
                    джерело клітковини і протеїну як компонент раціону або
                    добавка. Часто входять до складу повнораціонного комбікорму
                    як основа клітковини.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="cf-sub-title">
              Гранула vs зернова суміш — в чому різниця
            </h3>
            <div className="cf-table-wrap">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Параметр</th>
                    <th>Гранульований комбікорм</th>
                    <th>Зернова суміш</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Збалансованість</td>
                    <td>
                      <span className="cf-badge green">
                        Кожна гранула однакова
                      </span>
                    </td>
                    <td>
                      <span className="cf-badge orange">
                        Кроль вибирає компоненти
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Вітаміни і мінерали</td>
                    <td>
                      <span className="cf-badge green">Вже включені</span>
                    </td>
                    <td>
                      <span className="cf-badge orange">
                        Потрібно додавати окремо
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Клітковина</td>
                    <td>
                      <span className="cf-badge green">
                        Регульована (трав'яне борошно)
                      </span>
                    </td>
                    <td>
                      <span className="cf-badge orange">
                        Залежить від складу суміші
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Зручність</td>
                    <td>
                      <span className="cf-badge green">Насипав і все</span>
                    </td>
                    <td>
                      <span className="cf-badge orange">
                        Потрібно самостійно складати
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Ціна</td>
                    <td>
                      <span className="cf-badge orange">Дорожче</span>
                    </td>
                    <td>
                      <span className="cf-badge green">Дешевше</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Контроль складу</td>
                    <td>
                      <span className="cf-badge orange">
                        Залежить від виробника
                      </span>
                    </td>
                    <td>
                      <span className="cf-badge green">Знаєш що сипеш</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cf-alert tip">
              💡 Для невеликого господарства зернова суміш + окремі добавки
              часто вигідніша. Для великого промислового стада — гранульований
              комбікорм зручніший і точніший.
            </div>
          </div>
        )}

        {/* ── ТИПИ ТА МАРКУВАННЯ ── */}
        {activeTab === "types" && (
          <div className="cf-content">
            <div className="cf-note">
              <p>
                В Україні та країнах СНД комбікорми для кролів маркуються
                абревіатурою <strong>ПК</strong> — повнораціонний комбікорм.
                Цифра після ПК вказує на вид тварини і фазу годівлі.
                Повнораціонний (ПК) не потребує добавок окрім сіна і води.
              </p>
            </div>

            <h3 className="cf-sub-title">Маркування ПК для кролів</h3>
            <div className="cf-pk-grid">
              <div className="cf-pk-card">
                <span className="cf-pk-code">ПК-90</span>
                <span className="cf-pk-age">від 30 днів до забою</span>
                <p>
                  Стартово-відгодівельний. Найпоширеніший тип. Використовується
                  від відлучення молодняку (30–45 днів) до забою. Підходить для
                  більшості господарств як основний комбікорм. Протеїн ~17–18%,
                  клітковина ~14–15%.
                </p>
              </div>
              <div className="cf-pk-card">
                <span className="cf-pk-code">ПК-91</span>
                <span className="cf-pk-age">
                  молодняк від відсадки до 4 місяців
                </span>
                <p>
                  Для молодняку після відлучення. Вищий рівень протеїну для
                  підтримки активного росту. Відрізняється від ПК-90 дещо вищим
                  вмістом білка і збалансованим амінокислотним профілем для
                  молодого організму.
                </p>
              </div>
              <div className="cf-pk-card">
                <span className="cf-pk-code">ПК-92</span>
                <span className="cf-pk-age">дорослі кролі від 4 місяців</span>
                <p>
                  Для дорослих кролів на підтримувальному годуванні — самці поза
                  злучкою, самки поза вагітністю і лактацією. Менше протеїну,
                  більше клітковини. Запобігає ожирінню при стаціонарному
                  утриманні.
                </p>
              </div>
              <div className="cf-pk-card">
                <span className="cf-pk-code">ПК-93</span>
                <span className="cf-pk-age">
                  відгодівля молодняку від 2 місяців
                </span>
                <p>
                  Спеціалізований відгодівельний комбікорм для інтенсивного
                  нарощування маси перед забоєм. Підвищена енергетична цінність,
                  оптимальне співвідношення протеїну для конверсії корму у
                  м'язову масу.
                </p>
              </div>
            </div>

            <h3 className="cf-sub-title">Старт і фініш — що це означає</h3>
            <div className="cf-cards-grid">
              <div className="cf-card start">
                <span className="cf-card-icon">🚀</span>
                <div>
                  <span className="cf-card-title">
                    Старт (стартовий комбікорм)
                  </span>
                  <p>
                    Призначений для молодняку з моменту відлучення (28–45 днів)
                    до 60–70 днів. Підвищений вміст протеїну (18–20%) для
                    підтримки швидкого росту. Дрібніший помол або менший діаметр
                    гранули — для кроленят з незрілим травленням. Часто містить
                    пробіотики або підкислювачі для підтримки мікрофлори.
                  </p>
                  <div className="cf-inline-alert warn">
                    ⚠️ Стартовий комбікорм не можна давати різко після молока —
                    перехід 7–14 днів обов'язковий.
                  </div>
                </div>
              </div>
              <div className="cf-card finish">
                <span className="cf-card-icon">🏁</span>
                <div>
                  <span className="cf-card-title">
                    Фініш (фінішний комбікорм)
                  </span>
                  <p>
                    Використовується в останні 2–3 тижні перед забоєм (зазвичай
                    з 70–75 до 90–100 днів). Підвищена енергетична цінність для
                    максимального приросту. Може містити більше крохмалю і жирів
                    для «заливки» м'яса. Менше клітковини порівняно зі стартом.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="cf-sub-title">Інші типи маркування</h3>
            <div className="cf-table-wrap">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Маркування</th>
                    <th>Що означає</th>
                    <th>Коли використовувати</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>КК-90</strong>
                    </td>
                    <td>
                      Концентрований комбікорм — не повнораціонний, потребує
                      додавання зерна і грубих кормів
                    </td>
                    <td>Як добавка до власної зернової суміші</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ПЗК-91</strong>
                    </td>
                    <td>
                      Повнозерновий комбікорм — містить цілі або плющені зерна
                    </td>
                    <td>Альтернатива гранулі, зберігає структуру зерна</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>БМВД</strong>
                    </td>
                    <td>
                      Білково-мінерально-вітамінна добавка — без зернової основи
                    </td>
                    <td>Додається до власного зерна у % співвідношенні</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Гровер</strong>
                    </td>
                    <td>
                      Ростовий — між стартом і фінішем, для активного приросту
                    </td>
                    <td>60–75 днів при трифазній схемі годівлі</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── СКЛАД ── */}
        {activeTab === "composition" && (
          <div className="cf-content">
            <div className="cf-note">
              <p>
                Якісний повнораціонний комбікорм складається з кількох
                обов'язкових груп компонентів. Кожна група виконує свою функцію.
                Розуміння складу допомагає читати етикетку і оцінювати якість
                продукту.
              </p>
            </div>

            <h3 className="cf-sub-title">Основні групи компонентів</h3>

            <div className="cf-comp-list">
              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">🌾</span>
                  <span className="cf-comp-title">Зернові — 30–45% складу</span>
                </div>
                <p>
                  Основне джерело енергії (крохмаль). Ячмінь, пшениця,
                  кукурудза, овес. Ячмінь — найкращий для кролів: помірний
                  крохмаль, хороша клітковина лушпиння. Кукурудза — висока
                  енергія, але багато крохмалю, тому не більше 15–20% від
                  складу. Овес — добре перетравлюється молодняком.
                </p>
                <div className="cf-comp-tip">
                  Висівки пшениці часто замінюють частину зерна — вони дешевші і
                  дають клітковину.
                </div>
              </div>

              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">🫘</span>
                  <span className="cf-comp-title">
                    Білкові компоненти — 15–25% складу
                  </span>
                </div>
                <p>
                  Джерело протеїну і амінокислот. Найпоширеніші: соняшниковий
                  шрот або макуха (протеїн 32–40%), соєвий шрот (протеїн
                  43–48%), кормові дріжджі (протеїн ~45%, джерело лізину і
                  вітамінів групи В). М'ясо-кісткове борошно використовується
                  рідко і тільки у невеликих кількостях.
                </p>
                <div className="cf-comp-tip">
                  Соєвий шрот — найповноцінніший рослинний білок за
                  амінокислотним профілем. Соняшниковий шрот — дешевший, але з
                  нижчою засвоюваністю.
                </div>
              </div>

              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">🌿</span>
                  <span className="cf-comp-title">
                    Грубі корми та клітковина — 10–20% складу
                  </span>
                </div>
                <p>
                  Трав'яне борошно з люцерни або тимофіївки — основне джерело
                  структурної клітковини в гранулі. Забезпечує перистальтику
                  кишечника і підтримує мікрофлору сліпої кишки. Вміст у
                  якісному комбікормі — мінімум 14%, оптимально 16–18%.
                </p>
              </div>

              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">🪨</span>
                  <span className="cf-comp-title">Мінеральні добавки</span>
                </div>
                <p>
                  Вапняк або крейда — кальцій (0.5–1.2%). Монокальційфосфат або
                  трикальційфосфат — фосфор (0.4–0.6%). Кухонна сіль — натрій
                  (0.3–0.5%). Мікроелементи: залізо, цинк, мідь, марганець, йод,
                  селен — у складі премікс.
                </p>
              </div>

              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">💊</span>
                  <span className="cf-comp-title">Вітамінний премікс</span>
                </div>
                <p>
                  Суміш жиро- і водорозчинних вітамінів: A, D3, E, K, вся група
                  B (B1, B2, B6, B12), ніацин, пантотенова кислота, холін,
                  біотин, фолієва кислота. В якісному ПК-комбікормі не потрібно
                  давати вітаміни окремо — вони вже у складі.
                </p>
                <div className="cf-comp-tip">
                  Додаткова дача вітамінів (Чіктонік та ін.) поверх
                  повнораціонного ПК-комбікорму не дає користі і може спричинити
                  гіпервітаміноз A і D.
                </div>
              </div>

              <div className="cf-comp-item">
                <div className="cf-comp-head">
                  <span className="cf-comp-icon">🧬</span>
                  <span className="cf-comp-title">
                    Функціональні добавки (у сучасних кормах)
                  </span>
                </div>
                <p>
                  Пробіотики (Lactobacillus, Enterococcus) — підтримка
                  мікрофлори кишечника, особливо важливо для стартових кормів.
                  Підкислювачі (органічні кислоти) — знижують pH ШКТ,
                  пригнічують патогени. Антиоксиданти — стабілізують жири і
                  вітаміни при зберіганні. Ферменти — покращують засвоєння
                  фосфору і крохмалю.
                </p>
              </div>
            </div>

            <h3 className="cf-sub-title">Як читати склад на упаковці</h3>
            <div className="cf-cards-grid">
              <div className="cf-card ok">
                <span className="cf-card-icon">✅</span>
                <div>
                  <span className="cf-card-title">Хороші ознаки</span>
                  <p>
                    Перші в списку: зерно (ячмінь, пшениця) + трав'яне борошно +
                    шрот. Клітковина мінімум 14%. Протеїн 16–18%. Є мінерали і
                    вітаміни в складі.
                  </p>
                </div>
              </div>
              <div className="cf-card danger">
                <span className="cf-card-icon">❌</span>
                <div>
                  <span className="cf-card-title">Тривожні ознаки</span>
                  <p>
                    Перша позиція — кукурудза або висівки без трав'яного
                    борошна. Клітковина нижче 12%. Немає вказівки на вміст
                    мінералів. Немає дати виробництва або вона стерта.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ПРОТЕЇН І КЛІТКОВИНА ── */}
        {activeTab === "nutrients" && (
          <div className="cf-content">
            <p className="cf-intro">
              Два найважливіші показники якості комбікорму для кролів — протеїн
              і клітковина. Знати їх норми і розуміти функцію — означає вміти
              оцінити корм не за ціною, а за суттю.
            </p>

            <h3 className="cf-sub-title">Протеїн (сирий протеїн, СП)</h3>
            <div className="cf-nutrient-card protein">
              <div className="cf-nutrient-header">
                <span>🫘</span>
                <span>Що це і навіщо</span>
              </div>
              <p>
                Протеїн — це білок, будівельний матеріал для м'язів, органів,
                ферментів і антитіл. «Сирий протеїн» на етикетці — це загальний
                азот у кормі, перерахований на білок. Він не відображає
                засвоюваність — важливо також звідки цей протеїн. Соєвий шрот і
                кормові дріжджі дають добре засвоюваний амінокислотний профіль;
                сечовина теж дасть «протеїн» на аналізі, але для кролів марна.
              </p>
              <div className="cf-table-wrap" style={{ marginTop: "12px" }}>
                <table className="cf-table">
                  <thead>
                    <tr>
                      <th>Група кролів</th>
                      <th>Норма протеїну</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Молодняк від відлучення до 12 тижнів</td>
                      <td>
                        <strong>16–18%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Молодняк на відгодівлі (12–16 тижнів)</td>
                      <td>
                        <strong>15–17%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Дорослі кролі на підтриманні</td>
                      <td>
                        <strong>12–14%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Самки в другій половині вагітності</td>
                      <td>
                        <strong>16–18%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Годуючі самки (лактація)</td>
                      <td>
                        <strong>18–20%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Плідники в сезон злучки</td>
                      <td>
                        <strong>15–17%</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cf-alert warn" style={{ marginTop: "10px" }}>
                ⚠️ Надлишок протеїну (більше 20%) у дорослих кролів підвищує
                навантаження на нирки, збільшує виділення аміаку в кролятнику і
                може порушити баланс мікрофлори сліпої кишки.
              </div>
            </div>

            <h3 className="cf-sub-title">Клітковина (сира клітковина, СК)</h3>
            <div className="cf-nutrient-card fiber">
              <div className="cf-nutrient-header">
                <span>🌿</span>
                <span>Що це і навіщо</span>
              </div>
              <p>
                Клітковина — целюлоза і геміцелюлоза рослинних клітинних стінок.
                Для кроля це не просто «наповнювач» — це ключовий компонент
                здоров'я. Клітковина: стимулює перистальтику кишечника (без неї
                — стаз), стирає зуби що постійно ростуть (без стирання —
                маклодоція), підтримує мікрофлору сліпої кишки. Клітковина в
                комбікормі — це «структурна» клітковина (НДФ), а не просто
                лігнін. Сіно дає додаткову структурну клітковину і є
                обов'язковим доповненням навіть при правильному комбікормі.
              </p>
              <div className="cf-table-wrap" style={{ marginTop: "12px" }}>
                <table className="cf-table">
                  <thead>
                    <tr>
                      <th>Ситуація</th>
                      <th>Рекомендований вміст СК</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Молодняк після відлучення</td>
                      <td>
                        <strong>мінімум 14%, оптимально 16%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Відгодівля (м'ясне виробництво)</td>
                      <td>
                        <strong>14–16%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Дорослі кролі, підтримання</td>
                      <td>
                        <strong>16–18%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Ожирілі або малорухливі</td>
                      <td>
                        <strong>18–22%+</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cf-alert tip" style={{ marginTop: "10px" }}>
                💡 Правило: клітковина повинна завжди перевищувати протеїн у
                складі комбікорму. СК 16% і СП 18% — нормальне співвідношення
                для молодняку. СК 12% і СП 20% — поганий корм для кролів.
              </div>
            </div>

            <h3 className="cf-sub-title">Інші важливі показники</h3>
            <div className="cf-cards-grid">
              <div className="cf-card">
                <span className="cf-card-icon">⚡</span>
                <div>
                  <span className="cf-card-title">Обмінна енергія (ОЕ)</span>
                  <p>
                    Вказується в ккал або МДж/кг. Для відгодівлі — 2500–2700
                    ккал/кг. Для підтримання — 2200–2400 ккал/кг. Занадто висока
                    енергія при малій рухливості — ожиріння.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🦴</span>
                <div>
                  <span className="cf-card-title">Кальцій і фосфор</span>
                  <p>
                    Ca: 0.5–1.2%. P: 0.4–0.6%. Співвідношення Ca:P має бути
                    1.5–2:1. Надлишок кальцію при низькому фосфорі — сечокам'яна
                    хвороба при тривалому годуванні.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">💧</span>
                <div>
                  <span className="cf-card-title">Вологість</span>
                  <p>
                    Максимум 14% у якісному кормі. Вище 14% — ризик плісняви при
                    зберіганні. Цвілий корм спричиняє мікотоксикоз. Перевіряйте:
                    злиплі гранули або затхлий запах — ознака вологого або
                    зіпсованого корму.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🥑</span>
                <div>
                  <span className="cf-card-title">Жир (сирий жир)</span>
                  <p>
                    Оптимально 2–3%. Більше 5% — ризик окиснення жирів при
                    зберіганні (прогіркання). Підвищений жир виправданий у
                    кормах для годуючих самок і при морозах.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── НОРМИ ГОДІВЛІ ── */}
        {activeTab === "norms" && (
          <div className="cf-content">
            <p className="cf-intro">
              Норма залежить від віку, стану і виду тварини. Вказані значення —
              орієнтовні для повнораціонного гранульованого комбікорму. Сіно —
              завжди окремо, в необмеженій кількості.
            </p>

            <div className="cf-table-wrap">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Група</th>
                    <th>Добова норма комбікорму</th>
                    <th>Примітки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Молодняк 30–45 днів</strong>
                    </td>
                    <td>50–80 г</td>
                    <td>Стартовий корм. Вільний доступ або 2 рази на день</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Молодняк 45–90 днів</strong>
                    </td>
                    <td>100–140 г</td>
                    <td>Основний відгодівельний період</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Молодняк 90–120 днів (фініш)</strong>
                    </td>
                    <td>140–180 г</td>
                    <td>Фінішний корм, максимальний приріст</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Дорослий кроль (підтримання)</strong>
                    </td>
                    <td>120–170 г</td>
                    <td>ПК-92, без надлишку</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Самка в злучці</strong>
                    </td>
                    <td>170–210 г</td>
                    <td>Збільшити за 7–10 днів до злучки</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Самка 1-а половина вагітності</strong>
                    </td>
                    <td>150–170 г</td>
                    <td>Не перегодовувати — ожиріння ускладнює окріл</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Самка 2-а половина вагітності</strong>
                    </td>
                    <td>170–200 г</td>
                    <td>З 21 дня тільності збільшити порцію</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Годуюча самка (лактація)</strong>
                    </td>
                    <td>400–600 г</td>
                    <td>Вільний доступ або 3–4 рази на день</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Плідник поза злучкою</strong>
                    </td>
                    <td>130–150 г</td>
                    <td>Не перегодовувати — ожиріння знижує лібідо</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Плідник у сезон злучки</strong>
                    </td>
                    <td>160–200 г</td>
                    <td>ПК-91 або ПК-90 з підвищеним протеїном</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cf-alert warn">
              ⚠️ Годуюча самка з великим послідом (8+ кроленят) потребує
              вільного доступу до корму — обмежене годування знизить молочність
              і призведе до виснаження.
            </div>

            <h3 className="cf-sub-title">Режим годівлі</h3>
            <div className="cf-cards-grid">
              <div className="cf-card">
                <span className="cf-card-icon">🌅</span>
                <div>
                  <span className="cf-card-title">Двофазне годування</span>
                  <p>
                    Вранці — половина добової норми комбікорму. Ввечері — друга
                    половина. Вдень — сіно і вода. Найпоширеніша схема для
                    дорослих кролів і молодняку на підтриманні.
                  </p>
                </div>
              </div>
              <div className="cf-card">
                <span className="cf-card-icon">🔓</span>
                <div>
                  <span className="cf-card-title">Вільний доступ</span>
                  <p>
                    Застосовується для молодняку у перші 2–3 тижні після
                    відлучення і для годуючих самок. Бункерна годівниця завжди
                    заповнена. Ризик ожиріння у дорослих тварин при такому
                    підході.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="cf-sub-title">
              Як зрозуміти що норма підібрана правильно
            </h3>
            <div className="cf-checklist">
              <div className="cf-check-item ok">
                <span>✓</span>
                <span>
                  Кроль з'їдає порцію протягом 2–3 годин і не облизує порожню
                  годівницю
                </span>
              </div>
              <div className="cf-check-item ok">
                <span>✓</span>
                <span>
                  Приріст ваги молодняку — 30–40 г на добу для середніх порід
                </span>
              </div>
              <div className="cf-check-item ok">
                <span>✓</span>
                <span>
                  Послід рівний, нормального розміру, не надто дрібний і не
                  надто м'який
                </span>
              </div>
              <div className="cf-check-item warn">
                <span>!</span>
                <span>
                  Якщо кроль залишає корм — норма завелика або корм не
                  подобається
                </span>
              </div>
              <div className="cf-check-item warn">
                <span>!</span>
                <span>
                  Якщо кроль з'їдає все за 30 хвилин і шукає ще — норма замала
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── СВОЇМИ РУКАМИ ── */}
        {activeTab === "diy" && (
          <div className="cf-content">
            <div className="cf-note">
              <p>
                Приготування комбікорму вдома має сенс при поголів'ї від 30–50
                кролів і наявності власної зерносировини. При меншому стаді —
                покупний ПК-комбікорм вигідніший за часом і якістю.
              </p>
            </div>

            <h3 className="cf-sub-title">Приклад рецептів зернової суміші</h3>

            <div className="cf-recipe-grid">
              <div className="cf-recipe-card">
                <span className="cf-recipe-title">Молодняк та відгодівля</span>
                <div className="cf-recipe-rows">
                  <div className="cf-recipe-row">
                    <span>Ячмінь</span>
                    <span>30%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Пшениця</span>
                    <span>20%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Кукурудза</span>
                    <span>10%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Висівки пшеничні</span>
                    <span>15%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Соняшниковий шрот</span>
                    <span>12%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Трав'яне борошно</span>
                    <span>10%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Мінерали + вітаміни</span>
                    <span>3%</span>
                  </div>
                </div>
                <div className="cf-recipe-result">СП ~16–17% / СК ~15%</div>
              </div>

              <div className="cf-recipe-card">
                <span className="cf-recipe-title">Годуючі самки</span>
                <div className="cf-recipe-rows">
                  <div className="cf-recipe-row">
                    <span>Ячмінь</span>
                    <span>25%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Овес</span>
                    <span>15%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Пшениця</span>
                    <span>15%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Соєвий шрот</span>
                    <span>15%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Соняшниковий шрот</span>
                    <span>10%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Трав'яне борошно</span>
                    <span>15%</span>
                  </div>
                  <div className="cf-recipe-row">
                    <span>Мінерали + вітаміни</span>
                    <span>5%</span>
                  </div>
                </div>
                <div className="cf-recipe-result">СП ~18–19% / СК ~16%</div>
              </div>
            </div>

            <h3 className="cf-sub-title">
              Мінеральна частина — на 100 кг суміші
            </h3>
            <div className="cf-table-wrap">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Компонент</th>
                    <th>Кількість</th>
                    <th>Функція</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Крейда кормова</td>
                    <td>500–700 г</td>
                    <td>Кальцій</td>
                  </tr>
                  <tr>
                    <td>Монокальційфосфат</td>
                    <td>300–400 г</td>
                    <td>Фосфор і кальцій</td>
                  </tr>
                  <tr>
                    <td>Кухонна сіль</td>
                    <td>300–400 г</td>
                    <td>Натрій, хлор</td>
                  </tr>
                  <tr>
                    <td>Вітамінно-мінеральний премікс</td>
                    <td>500–1000 г (за інструкцією)</td>
                    <td>Мікроелементи, вітаміни</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="cf-sub-title">Зберігання комбікорму</h3>
            <div className="cf-cards-grid">
              <div className="cf-card ok">
                <span className="cf-card-icon">✅</span>
                <div>
                  <span className="cf-card-title">Правила зберігання</span>
                  <p>
                    Сухе приміщення, вологість повітря не більше 70–75%.
                    Температура +5 до +25°C. Закриті ємності або мішки захищені
                    від гризунів. Гранула — до 3–4 місяців. Розсип — до 2
                    місяців.
                  </p>
                </div>
              </div>
              <div className="cf-card danger">
                <span className="cf-card-icon">❌</span>
                <div>
                  <span className="cf-card-title">
                    Ознаки зіпсованого корму
                  </span>
                  <p>
                    Затхлий або кислий запах. Злиплі або покриті нальотом
                    гранули. Сліди плісняви (чорні або зелені плями). Зміна
                    кольору. Такий корм давати кролям не можна — мікотоксини не
                    знищуються термічно.
                  </p>
                </div>
              </div>
            </div>

            <div className="cf-alert warn">
              ⚠️ Ніколи не давайте кролям корм із цвіллю. Мікотоксини
              (афлатоксини) накопичуються в печінці, спричиняють хронічне
              отруєння і знижують імунітет. Уражений мішок — повністю в
              утилізацію.
            </div>
          </div>
        )}

        <div className="cf-back">
          <Link to="/" className="cf-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CompoundFeed;
