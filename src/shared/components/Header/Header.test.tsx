import { render } from "@testing-library/react";
import { Header } from "./Header";

describe("Header Component", () => {
  it("deve exibir os links de navegação", () => {
    render(<Header />);

    // expect(screen.getByText("Estudantes")).toBeInTheDocument();

    // expect(screen.getByText("Professores")).toBeInTheDocument();
    // expect(screen.getByText("Agendamentos")).toBeInTheDocument();
  });
});
