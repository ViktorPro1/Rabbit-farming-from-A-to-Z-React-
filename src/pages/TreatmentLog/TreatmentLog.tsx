import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./TreatmentLog.css";
import ShareButton from "../../components/ShareButton/ShareButton";

export default function TreatmentLog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="trlog">
      {/* HERO */}
      <section className="trlog__hero">
        <div className="trlog__hero-inner">
          <h1 className="trlog__title">Журнал лікувань та документація</h1>
          <p className="trlog__subtitle">
            Без записів навіть найдосвідченіший кролівник рано чи пізно
            переплутає, кому й коли давав препарат. Журнал — не бюрократія, а
            інструмент, що рятує від повторного лікування, передозування й
            продажу м'яса з залишками препарату в тканинах.
          </p>
        </div>
      </section>

      <div className="trlog__content">
        {/* НАВІЩО */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>🎯</span> Навіщо вести журнал
          </h2>
          <div className="trlog__grid">
            <div className="trlog__block">
              <h3 className="trlog__block-title">Безпека продукції</h3>
              <p>
                Термін виведення (withdrawal period) препарату відраховується
                від дати останнього введення. Без запису дати ви не можете
                достовірно знати, чи безпечне м'ясо для забою й продажу.
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">Контроль стада</h3>
              <p>
                Записи показують, які тварини хворіли повторно, які препарати не
                спрацювали, де в господарстві системна проблема — наприклад,
                повторний кокцидіоз у одній і тій самій клітці.
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">Розмова з ветеринаром</h3>
              <p>
                Історія лікувань конкретної тварини за хвилину дає ветеринару
                контекст, замість спроб пригадати "здається, місяць тому щось
                кололи".
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">Юридичний захист</h3>
              <p>
                При перевірці чи претензії з боку покупця документація — доказ,
                що господарство діяло відповідально. Див. також розділ
                «Юридичний куточок».
              </p>
            </div>
          </div>
        </section>

        {/* ЩО ФІКСУВАТИ - ЛІКУВАННЯ */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>💊</span> Журнал лікувань — обов'язкові поля
          </h2>
          <p className="trlog__section-intro">
            Практика, яку рекомендують міжнародні стандарти ветеринарного обліку
            у тваринництві (Beef Quality Assurance, UK Veterinary Medicines
            Directorate) — застосовна до будь-якого виду тварин, зокрема кролів.
          </p>
          <div className="trlog__fields">
            <div className="trlog__field">
              <span className="trlog__field-name">Ідентифікація тварини</span>
              <span className="trlog__field-desc">
                Бирка, номер клітки, кличка — те, за чим ви однозначно впізнаєте
                тварину пізніше.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Дата</span>
              <span className="trlog__field-desc">
                Дата кожного введення препарату, а не лише початку курсу.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Причина / діагноз</span>
              <span className="trlog__field-desc">
                Симптоми або підтверджений діагноз, через який призначено
                лікування.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Препарат і партія</span>
              <span className="trlog__field-desc">
                Назва препарату, номер партії (лот) — критично при відкликанні
                серії виробником.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Доза і шлях введення</span>
              <span className="trlog__field-desc">
                Скільки і як (перорально, підшкірно, внутрішньом'язово).
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Хто вводив</span>
              <span className="trlog__field-desc">
                Ви, член родини, ветеринар — важливо при кількох людях, які
                доглядають за стадом.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">
                Дата закінчення withdrawal
              </span>
              <span className="trlog__field-desc">
                Розрахована дата, після якої тварину безпечно забивати чи
                продавати. Дивіться термін на вкладці препарату.
              </span>
            </div>
            <div className="trlog__field">
              <span className="trlog__field-name">Результат</span>
              <span className="trlog__field-desc">
                Одужання, відсутність ефекту, повторний курс — коротка нотатка
                через кілька днів після лікування.
              </span>
            </div>
          </div>
        </section>

        {/* ВАКЦИНАЦІЇ */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>💉</span> Журнал вакцинацій — окремо від лікувань
          </h2>
          <p className="trlog__section-intro">
            Вакцинації варто вести окремим списком — тут головне не
            симптоматика, а графік і своєчасність ревакцинації.
          </p>
          <ul className="trlog__list">
            <li>Тварина, дата вакцинації, вакцина (VHD/ВГХК, міксоматоз)</li>
            <li>Виробник, номер партії, термін придатності флакона</li>
            <li>Дата наступної ревакцинації — щоб не пропустити</li>
            <li>
              Реакція тварини (набряк у місці ін'єкції, млявість) — якщо була
            </li>
          </ul>
          <p className="trlog__note">
            Пов'язано з розділом «Вакцинація», де є калькулятор дат для
            автоматичного розрахунку графіка.
          </p>
        </section>

        {/* ДЕГЕЛЬМІНТИЗАЦІЯ */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>🪱</span> Журнал дегельмінтизації
          </h2>
          <ul className="trlog__list">
            <li>Дата обробки, препарат, доза за вагою тварини</li>
            <li>Дата наступної планової обробки (зазвичай двічі на рік)</li>
            <li>Група тварин, яку обробляли одночасно</li>
          </ul>
        </section>

        {/* ЗАГИБЕЛЬ */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>☠️</span> Облік загибелі
          </h2>
          <p className="trlog__section-intro">
            Найважливіший, і водночас найчастіше пропускається розділ обліку —
            саме він допомагає вчасно побачити спалах хвороби в стаді.
          </p>
          <ul className="trlog__list">
            <li>Дата, тварина, підозрювана або підтверджена причина</li>
            <li>
              Результати розтину, якщо проводився (див. розділ «Некропсія»)
            </li>
            <li>Спосіб утилізації тушки</li>
            <li>Чи були поруч інші хворі тварини в той самий період</li>
          </ul>
          <div className="trlog__card trlog__card--warning">
            <strong>⚠️ Кластери загибелі</strong>
            <p>
              Дві чи більше загиблих тварин за короткий проміжок часу — привід
              переглянути записи разом: чи є спільний фактор (клітка, партія
              корму, дата обробки), і за потреби звернутись до лабораторії.
            </p>
          </div>
        </section>

        {/* ПРАКТИЧНІ ПОРАДИ */}
        <section className="trlog__section">
          <h2 className="trlog__section-title">
            <span>📋</span> Як вести записи на практиці
          </h2>
          <div className="trlog__grid">
            <div className="trlog__block">
              <h3 className="trlog__block-title">
                Паперовий журнал чи таблиця
              </h3>
              <p>
                Обидва варіанти працюють, якщо ведете системно. Головна умова —
                записувати одразу, а не "пізніше по пам'яті". Пам'ять підводить
                навіть при щирому бажанні бути точним.
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">
                Індивідуальна картка тварини
              </h3>
              <p>
                Для племінного поголів'я — окрема картка на тварину зручніша за
                загальний список: одразу видно всю історію одного кроля.
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">Щотижневий перегляд</h3>
              <p>
                Виділіть 5 хвилин на тиждень звірити записи й заповнити
                пропуски, поки деталі ще свіжі в пам'яті.
              </p>
            </div>
            <div className="trlog__block">
              <h3 className="trlog__block-title">Термін зберігання</h3>
              <p>
                Зберігайте записи щонайменше кілька років після продажу чи
                вибуття тварини — на випадок питань від покупця чи перевірки.
              </p>
            </div>
          </div>
        </section>

        {/* НАВІГАЦІЯ */}
        <div className="trlog__nav">
          <Link to="/vaccinations" className="trlog__nav-link">
            💉 Вакцинація
          </Link>
          <Link to="/drug-compatibility" className="trlog__nav-link">
            ⚗️ Сумісність препаратів
          </Link>
          <Link to="/necropsy" className="trlog__nav-link">
            ☠️ Некропсія
          </Link>
          <Link to="/legal" className="trlog__nav-link">
            ⚖️ Юридичний куточок
          </Link>
          <Link to="/pedigree-records" className="trlog__nav-link">
            📖 Родоводи та племінний облік
          </Link>
        </div>
        <div className="trlog-back">
          <Link to="/" className="trlog-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Журнал лікувань та документація" />
        </div>
      </div>
    </main>
  );
}
