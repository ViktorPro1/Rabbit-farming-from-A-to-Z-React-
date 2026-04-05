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
    { id: 'grey-giant', name: 'Сірий велетень', weight: '5–7 кг', weightNum: 6, type: 'universal' },
    { id: 'white-giant', name: 'Білий велетень', weight: '5–6.5 кг', weightNum: 5.75, type: 'universal' },
    { id: 'chinchilla', name: 'Радянська шиншила', weight: '5–7 кг', weightNum: 6, type: 'fur' },
    { id: 'chinchilla-giant', name: 'Шиншила велика', weight: '5.5–7.5 кг', weightNum: 6.5, type: 'fur' },
    { id: 'rex', name: 'Рекс', weight: '3.5–4.5 кг', weightNum: 4, type: 'fur' },
    { id: 'vienna-blue', name: 'Віденський блакитний', weight: '4.5–5 кг', weightNum: 4.75, type: 'universal' },
    { id: 'black-brown', name: 'Чорно-бурий', weight: '5–7 кг', weightNum: 6, type: 'universal' },
    { id: 'poltava-silver', name: 'Полтавське срібло', weight: '5–6.5 кг', weightNum: 5.75, type: 'universal' },
    { id: 'butterfly', name: 'Метелик', weight: '3.5–5 кг', weightNum: 4.25, type: 'universal' },
    { id: 'termond', name: 'Термонський', weight: '4.5–5.5 кг', weightNum: 5, type: 'meat' },
    { id: 'himalayan', name: 'Гімалайський', weight: '2.5–3.5 кг', weightNum: 3, type: 'fur' },
]