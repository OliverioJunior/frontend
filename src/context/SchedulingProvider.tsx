import { useScheduling } from "../hooks/useScheduling";
import { SchedulingContext } from "./SchedulingContext";

interface ISchedulingProvider {
  children: React.ReactNode;
}

export const SchedulingProvider: React.FC<ISchedulingProvider> = ({
  children,
}) => {
  const { scheduling, reFetch } = useScheduling();

  const contextValues = {
    scheduling,
    reFetch,
  };

  return (
    <SchedulingContext.Provider value={contextValues}>
      {children}
    </SchedulingContext.Provider>
  );
};
