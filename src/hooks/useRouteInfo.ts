import { useLocation } from "react-router";
import type { TRoutes } from "../shared/components/Header/components/RouteActions/RouteActions";
/**
 * Hook para obter informações da rota atual
 * @returns Objeto contendo título e chave da rota
 */
export const useRouteInfo = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const mainSegment =
    pathSegments.find((segment) => segment !== "dashboard") || "/";

  const routeTitles = {
    "students-management": "Gestão de Estudantes",
    "students-scheduling": "Agendamentos",
    "teachers-management": "Professores",
    "teachers-scheduling": "Agendamentos",
  } as const;

  return {
    title:
      routeTitles[mainSegment as keyof typeof routeTitles] ||
      "Bem vindo ADMIN!",
    key: mainSegment as TRoutes,
  };
};
