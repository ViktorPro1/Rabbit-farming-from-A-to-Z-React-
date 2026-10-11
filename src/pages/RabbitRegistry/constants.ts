export const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

export const archiveReasons = [
  { value: "slaughter", label: "Вибракування (забій)" },
  { value: "died", label: "Загинула" },
  { value: "sold", label: "Продана" },
  { value: "other", label: "Інше" },
];
