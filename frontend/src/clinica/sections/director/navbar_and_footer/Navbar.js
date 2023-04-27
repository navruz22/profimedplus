import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { useToast } from "@chakra-ui/react";
import AloLogo from "../../../../clinica_logo.jpg"

export const Navbar = () => {
  const history = useHistory();
  //====================================================================
  //====================================================================
  const toast = useToast();

  const notify = useCallback(
    (data) => {
      toast({
        title: data.title && data.title,
        description: data.description && data.description,
        status: data.status && data.status,
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const { request } = useHttp();
  const auth = useContext(AuthContext);

  const [user, setUser] = useState(auth.user);
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const getDirector = useCallback(async () => {
    try {
      const data = await request(
        "/api/director",
        "POST",
        {
          directorId: auth.userId,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setUser(data);
    } catch (error) {
      notify({ title: error, description: "", status: "error" });
    }
  }, [request, auth, notify]);

  //====================================================================
  //====================================================================

  const [baseUrl, setBaseUrl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //====================================================================
  //====================================================================

  const [activePage, setActivePage] = useState(window.location.pathname)

  //====================================================================
  //====================================================================

  const [t, setT] = useState(0)
  useEffect(() => {
    if (!t) {
      setT(1)
      getDirector();
      getBaseUrl()
    }
  }, [getDirector, getBaseUrl, t]);
  //====================================================================
  //====================================================================

  return (<div>
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg custom-navbar">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#royalHospitalsNavbar"
          aria-controls="royalHospitalsNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i />
            <i />
            <i />
          </span>
        </button>
        <div
          className="bg-[#00c2cb] collapse navbar-collapse justify-content-between"
          id="royalHospitalsNavbar"
        >
          <ul className="bg-[#00c2cb]  navbar-nav">
            <li className="nav-item  px-2">
              <img src={AloLogo} alt="logo" className="w-[100px]" />
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activePage === "/alo24" ? "active-page" : ""
                  }`}
                to="/alo24"
                onClick={() => setActivePage('/alo24')}
                style={{ background: activePage === "/alo24" || activePage === "/" ? "#F97316" : "" }}
              >
                <i className="icon-devices_other nav-icon" />
                Bosh sahifa
              </Link>
            </li>
            <li className="nav-item dropdown">
              <span
                id="doctoRs"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className={`nav-link ${activePage === "/alo24/departments" ||
                  activePage === "/alo24/servicetypes" ||
                  activePage === "/alo24/services" ||
                  activePage === "/alo24/rooms" ||
                  activePage === "/alo24/products" ||
                  activePage === "/alo24/recieptproducts" ||
                  activePage === "/alo24/rooms" ||
                  activePage === "/alo24/productconnector"
                  ? "bg-orange-500 active-page"
                  : ""
                  }`}
                style={{
                  background: activePage === "/alo24/departments" ||
                    activePage === "/alo24/servicetypes" ||
                    activePage === "/alo24/services" ||
                    activePage === "/alo24/rooms" ||
                    activePage === "/alo24/products" ||
                    activePage === "/alo24/recieptproducts" ||
                    activePage === "/alo24/rooms" ||
                    activePage === "/alo24/productconnector"
                    ? "#F97316"
                    : ""
                }}
              >
                <i className="icon-users nav-icon" />
                Xizmatlar
              </span>
              <ul className="dropdown-menu" aria-labelledby="doctoRs">
                <li>
                  <Link
                    className="dropdown-toggle sub-nav-link"
                    to="#"
                    id="buttonsDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Xizmatlar
                  </Link>
                  <ul
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="buttonsDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" onClick={() => setActivePage('/alo24/departments')} to="/alo24/departments">
                        Bo'limlar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/alo24/servicetypes"
                        onClick={() => setActivePage('/alo24/servicetypes')}
                      >
                        Xizmat turlari
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" onClick={() => setActivePage('/alo24/services')} to="/alo24/services">
                        Xizmatlar
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link className="dropdown-item" onClick={() => setActivePage('/alo24/rooms')} to="/alo24/rooms">
                    Statsionar xonalar
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-toggle sub-nav-link"
                    to="#"
                    id="buttonsDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Omborxona
                  </Link>
                  <ul
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="buttonsDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" onClick={() => setActivePage('/alo24/products')} to="/alo24/products">
                        Barcha mahsulotlar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/alo24/recieptproducts"
                        onClick={() => setActivePage('/alo24/recieproducts')}
                      >
                        Keltirilgan mahsulotlar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/alo24/productconnector"
                        onClick={() => setActivePage('/alo24/productconnector')}
                      >
                        Xizmatlarga bog'lash
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link
                className={`nav-link ${activePage === "/alo24/users"
                  ? "active-page"
                  : ""
                  }`}
                to="/alo24/users"
                role="button"
                style={{ background: activePage === '/alo24/users' ? "#F97316" : "" }}
                onClick={() => setActivePage('/alo24/users')}
              >
                <i className="icon-book-open nav-icon" />
                Foydalanuvchilar
              </Link>
            </li>
            <li className="nav-item dropdown">
              <span
                to="#"
                id="formsDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className={`nav-link ${activePage === "/alo24/offlineclients" ||
                  activePage === "/alo24/statsionarclients"
                  ? "active-page"
                  : ""
                  }`}
                style={{
                  background: activePage === "/alo24/offlineclients" ||
                    activePage === "/alo24/statsionarclients"
                    ? "#F97316"
                    : ""
                }}
              >
                <i className="icon-edit1 nav-icon" />
                Mijozlar
              </span>
              <ul className="dropdown-menu" aria-labelledby="formsDropdown">
                <li>
                  <Link className="dropdown-item" to="/alo24/offlineclients"
                    onClick={() => setActivePage('/alo24/offlineclients')}
                  >
                    Kunduzgi
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/statsionarclients"
                    onClick={() => setActivePage('/alo24/statsionarclients')}
                  >
                    Statsionar
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link
                className={`nav-link ${activePage === "/alo24/adver"
                  ? "active-page"
                  : ""
                  }`}
                to="/alo24/adver"
                role="button"
                style={{ background: activePage === '/alo24/adver' ? "#F97316" : "" }}
                onClick={() => setActivePage('/alo24/adver')}
              >
                Marketing
              </Link>
            </li>
            <li className="nav-item dropdown">
              <span
                to="#"
                id="formsDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className={`nav-link ${activePage === "/alo24/mainreport" ||
                  activePage === "/alo24/statsionarreport" ||
                  activePage === "/alo24/discountreport" ||
                  activePage === "/alo24/debtreport" ||
                  activePage === "/alo24/counteragent" ||
                  activePage === "/alo24/doctor_procient" ||
                  activePage === "/alo24/nurse_profit" ||
                  activePage === "/alo24/expense" ||
                  activePage === "/alo24/directdoctors" 
                  ? "active-page"
                  : ""
                  }`}
                style={{
                  background: activePage === "/alo24/mainreport" ||
                    activePage === "/alo24/statsionarreport" ||
                    activePage === "/alo24/discountreport" ||
                    activePage === "/alo24/debtreport" ||
                    activePage === "/alo24/counteragent" ||
                    activePage === "/alo24/doctor_procient" ||
                    activePage === "/alo24/nurse_profit" ||
                    activePage === "/alo24/expense" ||
                    activePage === "/alo24/directdoctors" 
                    ? "#F97316"
                    : ""
                }}
              >
                <i className="icon-book-open nav-icon" />
                Hisob bo'limi
              </span>
              <ul className="dropdown-menu" aria-labelledby="uiElementsDropdown">
                <li>
                  <Link className="dropdown-item" to="/alo24/mainreport"
                    onClick={() => setActivePage('/alo24/mainreport')}
                  >
                    Kunduzgi
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/statsionarreport"
                    onClick={() => setActivePage('/alo24/statsionarreport')}
                  >
                    Statsionar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/discountreport"
                    onClick={() => setActivePage('/alo24/discountreport')}
                  >
                    Chegirmalar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/debtreport"
                    onClick={() => setActivePage('/alo24/debtreport')}
                  >
                    Qarzlar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/doctor_procient"
                    onClick={() => setActivePage('/alo24/doctor_procient')}
                  >
                    Shifokor ulushi
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/directdoctors"
                    onClick={() => setActivePage('/alo24/directdoctors')}
                  >
                    Yunaltiruvchi shifokor
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/nurse_profit"
                    onClick={() => setActivePage('/alo24/nurse_profit')}
                  >
                    Xamshira ulushi
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/counteragent"
                    onClick={() => setActivePage('/alo24/counteragent')}
                  >
                    Kontragent
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/alo24/expense"
                    onClick={() => setActivePage('/alo24/expense')}
                  >
                    Xarajatlar
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="header-actions py-1 mr-2">
            <li className="dropdown">
              <span
                id="userSettings"
                className="user-settings"
                data-toggle="dropdown"
                aria-haspopup="true"
              >
                <span className="user-name">
                  {user.firstname} {user.lastname}
                </span>
                <span className="avatar md">
                  {baseUrl ? (
                    <img
                      className="circle d-inline"
                      src={
                        baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                      }
                      alt={user.firstname + user.lastname}
                    />
                  ) : (
                    user.firstname + user.lastname
                  )}

                  <span className="status busy" />
                </span>
              </span>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="userSettings"
              >
                <div className="header-profile-actions">
                  <div className="header-user-profile">
                    <div className="header-user">
                      <img
                        src={
                          baseUrl &&
                          `${baseUrl}/api/upload/file/${user.image}`
                        }
                        alt={user.firstname + user.lastname}
                      />
                    </div>
                    {user.firstname} {user.lastname}
                    <p>Reseption</p>
                  </div>
                  <button
                    onClick={() => {
                      auth.logout();
                      history.push("/");
                    }}
                  >
                    <i className="icon-log-out1" /> Chiqish
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>)
};
