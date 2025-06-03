export const getRouteTitle = (path: string) => {
  const routeKey =
    path
      .split("/")
      .filter(Boolean)
      .find((segment) => segment !== "dashboard") ?? "";

  const routeTitles = {
    "students-management": "Gestão de Estudantes",
    "students-scheduling": "Agendamentos",
    "teachers-management": "Professores",
    "teachers-scheduling": "Agendamentos",
  } as const;

  const isValidKey = (key: string): key is keyof typeof routeTitles => {
    return key in routeTitles;
  };

  return isValidKey(routeKey) ? routeTitles[routeKey] : "Bem vindo ADMIN!";
};
