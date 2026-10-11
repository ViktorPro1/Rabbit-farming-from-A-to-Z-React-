export interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
  is_active: boolean;
  // Додано: шлях до фото у сховищі (null, якщо фото немає)
  photo_path: string | null;
}

export interface Stats {
  total: number;
  males: number;
  females: number;
  youngTotal: number;
  youngFromCages: number;
  youngFromPaddocks: number;
  paddockFemales: number;
  fatteningMales: number;
  fatteningFemales: number;
  fatteningUnknown: number;
  fatteningTotal: number;
  quarantineMales: number;
  quarantineFemales: number;
  quarantineUnknown: number;
  quarantineTotal: number;
}
