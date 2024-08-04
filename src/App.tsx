import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { SocketContext, socket } from "./context/SocketContext";
import LandingPage from "./components/home/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext, supabase } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import Navbar from "./components/navigation/Navbar";
import ThemePark from "./components/ThemeParkInteractiveMap/ThemePark";
import AdministrationLayout from "./components/administration/AdministrationLayout";
import AddNewMarker from "./components/administration/AddNewMarker";
import ListAllPois from "./components/administration/ListAllPois";
import { QueryClient, QueryClientProvider } from "react-query";
import CurrentTabProvider from "./context/CurrentTabProvider";
import PointOfInterestDetails from "./components/poi/PointOfInterestDetails";
import FilterProvider from "./context/FilterProvider";
import EditPoiComponent from "./components/administration/EditPoiComponent";
import ThemeProvider from "./context/ThemeProvider";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const queryClient = new QueryClient();

  return (
    <>
      <ThemeProvider>
        <CurrentTabProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthContext.Provider value={{ supabase, session }}>
                <SocketContext.Provider value={{ socket }}>
                  <FilterProvider>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <>
                            <Navbar />
                            <LandingPage />
                          </>
                        }
                      />
                      <Route
                        path="/theme-park"
                        element={
                          <>
                            <Navbar />
                            <ThemePark />
                          </>
                        }
                      />
                      <Route
                        path="/poi/:id"
                        element={
                          <>
                            <Navbar />
                            <PointOfInterestDetails />
                          </>
                        }
                      />
                      <Route
                        path="/admin/points-of-interest/:id"
                        element={
                          <AdministrationLayout>
                            <EditPoiComponent />
                          </AdministrationLayout>
                        }
                      />
                      <Route
                        path="/admin/points-of-interest/new"
                        element={
                          <AdministrationLayout>
                            <AddNewMarker />
                          </AdministrationLayout>
                        }
                      />
                      <Route
                        path="/admin/"
                        element={
                          <AdministrationLayout>
                            <ListAllPois />
                          </AdministrationLayout>
                        }
                      />
                      <Route
                        path="/admin/points-of-interest"
                        element={
                          <AdministrationLayout>
                            <AddNewMarker />
                          </AdministrationLayout>
                        }
                      />
                    </Routes>
                  </FilterProvider>
                </SocketContext.Provider>
              </AuthContext.Provider>
            </BrowserRouter>
          </QueryClientProvider>
        </CurrentTabProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
