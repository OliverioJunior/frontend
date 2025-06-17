import { useScheduling } from "../hooks/useScheduling";
import { SchedulingContext } from "./SchedulingContext";

interface ISchedulingProvider {
  children: React.ReactNode;
}

export const SchedulingProvider: React.FC<ISchedulingProvider> = ({
  children,
}) => {
  const { scheduling, reFetch, error, loading } = useScheduling();
  const contextValues = {
    scheduling,
    reFetch,
    error,
    loading,
  };
  return (
    <SchedulingContext.Provider value={contextValues}>
      {children}
    </SchedulingContext.Provider>
  );
};
