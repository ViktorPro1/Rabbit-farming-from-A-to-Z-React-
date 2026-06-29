export interface BreedingBreed {
    id: string
    name: string
    weight: string
    weightNum: number
    type: 'meat' | 'fur' | 'universal'
}

export const breedingBreeds: BreedingBreed[] = [
    { id: 'californian', name: 'Каліфорнійський', weight: '4–5 кг', weightNum: 4.5, type: 'meat' },
    { id: 'new-zealand', name: 'Новозеландський білий', weight: '4.5–5.5 кг', weightNum: 5, type: 'meat' },
    { id: 'burgundy', name: 'Бургундський', weight: '4–5 кг', weightNum: 4.5, type: 'meat' },
    { id: 'flandr', name: 'Фландр', weight: '7–12 кг', weightNum: 9, type: 'meat' },
    { id: 'german-spotted-giant', name: 'Німецький строкатий велетень', weight: '5.5–7 кг', weightNum: 6.25, type: 'universal' },
    { id: 'grey-giant', name: 'Сірий велетень', weight: '5–7 кг', weightNum: 6, type: 'universal' },
    { id: 'white-giant', name: 'Білий велетень', weight: '5–6.5 кг', weightNum: 5.75, type: 'universal' },
    { id: 'chinchilla', name: 'Шиншила', weight: '5–7 кг', weightNum: 6, type: 'fur' },
    { id: 'chinchilla-giant', name: 'Шиншила велика', weight: '5.5–7.5 кг', weightNum: 6.5, type: 'fur' },
    { id: 'rex', name: 'Рекс', weight: '3.5–4.5 кг', weightNum: 4, type: 'fur' },
    { id: 'vienna-blue', name: 'Віденський блакитний', weight: '4.5–5 кг', weightNum: 4.75, type: 'universal' },
    { id: 'vienna-white', name: 'Віденський білий', weight: '4–5 кг', weightNum: 4.5, type: 'meat' },
    { id: 'black-brown', name: 'Чорно-бурий', weight: '5–7 кг', weightNum: 6, type: 'universal' },
    { id: 'poltava-silver', name: 'Полтавське срібло', weight: '5–6.5 кг', weightNum: 5.75, type: 'universal' },
    { id: 'butterfly', name: 'Метелик', weight: '3.5–5 кг', weightNum: 4.25, type: 'universal' },
    { id: 'satin', name: 'Сатиновий', weight: '3.5–4.5 кг', weightNum: 4, type: 'fur' },
    { id: 'termond', name: 'Термонський', weight: '4.5–5.5 кг', weightNum: 5, type: 'meat' },
    { id: 'himalayan', name: 'Гімалайський', weight: '2.5–3.5 кг', weightNum: 3, type: 'fur' },
    { id: 'khilla', name: 'Хілла', weight: '5–6 кг', weightNum: 5.5, type: 'meat' },
    { id: 'pannonian-white', name: 'Панонська біла', weight: '5–6 кг', weightNum: 5.5, type: 'meat' },
    { id: 'riga', name: 'Різен', weight: '4–5 кг', weightNum: 4.5, type: 'universal' },
    { id: 'champagne', name: 'Шампань', weight: '4–5 кг', weightNum: 4.5, type: 'fur' },
    { id: 'soviet-marder', name: 'Мардер', weight: '3.5–4.5 кг', weightNum: 4, type: 'fur' },
    { id: 'squirrel', name: 'Білка', weight: '2.5–3 кг', weightNum: 2.75, type: 'fur' },
    { id: 'hyla', name: 'HYLA / промислові кроси', weight: '4.5–5.5 кг', weightNum: 5, type: 'meat' },
    { id: 'french-lop', name: 'Французький баран', weight: '5.5–8 кг', weightNum: 6.75, type: 'meat' },
]