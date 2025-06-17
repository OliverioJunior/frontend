import styles from "./table.module.css";
interface TableStateProps {
  loading: boolean;
  error: string | null;
}
interface ITable extends TableStateProps {
  TableHeader: React.ReactNode;
  TableBody: React.ReactNode;
}

const TableState = ({ loading, error }: TableStateProps) => {
  if (loading)
    return (
      <tr>
        <td>carregando...</td>
      </tr>
    );
  if (error && !loading)
    return (
      <tr>
        <td>{error}</td>
      </tr>
    );

  return null;
};

export const Table: React.FC<ITable> = ({
  TableHeader,
  TableBody,
  loading,
  error,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>{TableHeader}</tr>
        </thead>
        <tbody>
          {!loading && !error ? (
            TableBody
          ) : (
            <TableState loading={loading} error={error} />
          )}
        </tbody>
      </table>
    </div>
  );
};
