import { useContext } from "react";
import { SchedulingContext } from "../context/SchedulingContext";

export const useSchedulingContext = () => useContext(SchedulingContext);
