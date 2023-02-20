import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { useToast } from "@chakra-ui/react";

export const Navbar = ({ baseUrl }) => {
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

  const [activePage, setActivePage] = useState(window.location.pathname)

  //====================================================================
  //====================================================================
  useEffect(() => {
    getDirector();
  }, [getDirector]);
  //====================================================================
  //====================================================================

  return (
    <div>
      <header className="header p-0 bg-white">
        <div className="container-fluid bg-slate-100">
          {/* Row start */}
          <div className="row gutters">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
              <Link to="/alo24" className="logo" style={{ fontSize: "26pt" }}>
                Alo24
              </Link>
            </div>
            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
              {/* Header actions start */}
              <ul className="header-actions py-2">
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
                            baseUrl &&
                            `${baseUrl}/api/upload/file/${user.image}`
                          }
                          alt={user.firstname[0] + user.lastname[0]}
                        />
                      ) : (
                        user.firstname[0] + user.lastname[0]
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
                            alt={user.firstname[0] + user.lastname[0]}
                          />
                        </div>
                        {user.firstname} {user.lastname}
                        <p>Direktor</p>
                      </div>
                      <Link to="/alo24/editdirector">
                        <i className="icon-user1" /> Tahrirlash
                      </Link>
                      <Link to="/alo24/editdirectorpassword">
                        <i className="icon-vpn_key" /> Parolni o'zgartirish
                      </Link>
                      <button
                        onClick={() => {
                          auth.logout();
                          history.push("/");
                        }}
                      >
                        <i className="icon-log-out1" /> Sign Out
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              {/* Header actions end */}
            </div>
          </div>
          {/* Row end */}
        </div>
      </header>
      {/* Header end */}
      {/* *************
       ************ Header section end *************
       ************* */}

      <div className="container-fluid p-0">
        {/* Navigation start */}
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
            className="bg-slate-100 collapse navbar-collapse"
            id="royalHospitalsNavbar"
          >
            <ul className="bg-slate-100 navbar-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${activePage === "/alo24" ? "active-page" : ""
                    }`}
                  to="/alo24"
                  onClick={() => setActivePage('/alo24')}
                  style={{ background: activePage === "/alo24" || activePage === "/" ? "#00c2cb" : "" }}
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
                    ? "active-page"
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
                      ? "#00c2cb"
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
                  style={{ background: activePage === '/alo24/users' ? "#00c2cb" : "" }}
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
                      ? "#00c2cb"
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
                <span
                  className={`nav-link dropdown-toggle ${window.location.pathname === "/alo24/adver"
                    ? "active-page"
                    : ""
                    }`}
                  to="#"
                  id="uiElementsDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="icon-image nav-icon" />
                  Marketing
                </span>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="uiElementsDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/alo24/adver">
                      Reklamalar
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link ${activePage === "/alo24/mainreport"
                    ? "active-page"
                    : ""
                    }`}
                  to="/alo24/mainreport"
                  role="button"
                  style={{ background: activePage === '/alo24/mainreport' ? "#00c2cb" : "" }}
                  onClick={() => setActivePage('/alo24/mainreport')}
                >
                  <i className="icon-book-open nav-icon" />
                  Hisob bo'limi
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="graphsDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="icon-pie-chart1 nav-icon" />
                  Graphs
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="graphsDropdown"
                >
                  <li className="open-left">
                    <Link
                      className="dropdown-toggle sub-nav-link"
                      to="#"
                      id="apexDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Apex Graphs
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="apexDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="area-graphs.html">
                          Area Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="bar-graphs.html">
                          Bar Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="column-graphs.html">
                          Column Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="donut-graphs.html">
                          Donut Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="line-graphs.html">
                          Line Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="mixed-graphs.html">
                          Mixed Charts
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="pie-graphs.html">
                          Pie Charts
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="morris-graphs.html">
                      Morris Graphs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="vector-maps.html">
                      Vector Maps
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="google-maps.html">
                      Google Maps
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="loginDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="icon-alert-triangle nav-icon" />
                  Login
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="loginDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="login.html">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="signup.html">
                      Signup
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="forgot-pwd.html">
                      Forgot Password
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="newsletter.html">
                      Newsletter
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="error.html">
                      404
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="error2.html">
                      505
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
        {/* Navigation end */}
        <div className="main-container">
          {/* Page header start */}
          <div className="page-header bg-alotrade">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Bosh sahifa</li>
            </ol>
          </div>
          {/* Page header end */}
        </div>
      </div>
    </div>
  );
};
