import styles from "./Header.module.css";
import { useState } from "react";
import { Link } from "react-router";
import { FiUser } from "react-icons/fi";
import { PiGraduationCapLight } from "react-icons/pi";
import { useRouteInfo } from "../../../hooks/useRouteInfo";
import { getRouteTitle } from "./utils";
import { RouteActions } from "./components/RouteActions/RouteActions";

export const Header = () => {
  const { key } = useRouteInfo();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoSection}>
          <Link to="/dashboard" className={styles.logo}>
            <PiGraduationCapLight size={32} />
          </Link>
          <h1 className={styles.title}>{getRouteTitle(key)}</h1>
          <RouteActions
            isOpen={isModalOpen}
            onClosed={() => setModalOpen(false)}
            routeKey={key}
            openModal={() => {
              setModalOpen(true);
            }}
          />
        </div>

        <div className={styles.userSection}>
          <div className={styles.userMenuWrapper}>
            <button
              className={styles.userButton}
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            >
              <FiUser className={styles.userIcon} />
            </button>

            {isUserMenuOpen && (
              <div className={styles.userDropdown}>
                <ul className={styles.dropdownList}>
                  <li className={styles.dropdownItem}>Meu Perfil</li>
                  <li className={styles.dropdownItem}>
                    <button
                      className={styles.dropdownLink}
                      onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    >
                      Modo teste
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
