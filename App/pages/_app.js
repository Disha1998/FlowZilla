import "../styles/globals.css";
import "../pages/index.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { useEffect, useRef } from "react";
import { SupercoolAuthContextProvider } from "../context/supercoolContext";
import 'react-toastify/dist/ReactToastify.css';
// const dotenv = require("dotenv")

// dotenv.config()
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });

  return (
    <>
    {/* changess */}
      <Meta title="Home 1" />
{/* <Component></Component> */}
      <Provider store={store}>
        <ThemeProvider enableSystem={true} attribute="class">
          <MetaMaskProvider>
            <SupercoolAuthContextProvider>
              <UserContext.Provider value={{ scrollRef: scrollRef }}>
                {pid === "/login" ? (
                  <Component {...pageProps} />
                ) : (
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                )}
              </UserContext.Provider>
            </SupercoolAuthContextProvider>
          </MetaMaskProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
