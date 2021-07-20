import { SkynetClient } from "skynet-js";
import { useState, useEffect } from "react";
import { ContentRecordDAC } from "@skynetlabs/content-record-library";

import "./App.css";
import Dashboard from "./Components/Dashboard";

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
// const portal =
//   window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

// // Initiate the SkynetClient
// const client = new SkynetClient(portal);
const client = new SkynetClient();

const contentRecord = new ContentRecordDAC();

function App() {
  // const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [load, setLoad] = useState(false);

  // choose a data domain for saving files in MySky
  const dataDomain = "localhost";

  // On initial run, start initialization of MySky
  useEffect(() => {
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
  }, []);

  const handleMySkyLogin = async () => {
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  return (
    <div className="App">
      {loggedIn ? (
        <Dashboard  />
      ) : (
        <header className="App-header">
          <small style={{ marginBottom: 20 }}>
            Welcome To Skapp. Please login to get started
          </small>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="App-logo"
            alt="logo"
            width="155"
            height="101"
            class="h-20 desktop:h-10"
          >
            <defs>
              <filter id="LogoWhiteText_svg__a">
                <feColorMatrix
                  in="SourceGraphic"
                  values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
                ></feColorMatrix>
              </filter>
            </defs>
            <g fill="none" fill-rule="evenodd">
              <path
                fill="#00C65E"
                d="M0 8.762L43.44 31.68a1.86 1.86 0 01.406 3.012h-.022a20.395 20.395 0 01-4.536 3.106C25.25 44.845 8.84 34.069 9.75 18.402l5.809 4.007c1.738 9.146 11.411 14.423 20.054 10.941L0 8.762zm17.563 6.392l29.176 11.52a1.766 1.766 0 011.056 2.124v.037a1.773 1.773 0 01-2.554 1.065L17.563 15.154zM28.306.065c5.502-.472 12.377 1.596 16.474 6.872 3.45 4.453 4.162 9.894 3.919 15.513v-.015a1.783 1.783 0 01-2.432 1.511l-19.832-7.83 18.411 4.933a14.792 14.792 0 00-2.168-9.258c-6.029-9.672-20.279-9.2-25.65.853a15.237 15.237 0 00-.809 1.791l-4.937-2.628c.14-.207.287-.402.435-.601.236-.49.49-.988.771-1.475C15.762 4.07 21.242.736 27.021.201z"
              ></path>
              <g filter="url(#LogoWhiteText_svg__a)">
                <path
                  fill="#333"
                  fill-rule="nonzero"
                  d="M71.758 30.892c1.552 0 2.901-.25 4.048-.75 1.146-.499 2.03-1.2 2.65-2.105.62-.904.931-1.95.931-3.139 0-1.12-.28-2.075-.84-2.867-.56-.792-1.35-1.421-2.366-1.886-1.018-.465-2.199-.75-3.543-.852l-1.656-.155c-.93-.07-1.612-.323-2.043-.763-.43-.439-.646-.951-.646-1.537 0-.482.12-.93.362-1.343.241-.413.603-.74 1.086-.982.483-.24 1.086-.361 1.81-.361.759 0 1.384.133 1.875.4.492.267.862.62 1.112 1.06.25.438.375.916.375 1.433h3.595c0-1.223-.284-2.286-.853-3.19-.57-.905-1.371-1.606-2.405-2.106-1.035-.499-2.268-.749-3.7-.749-1.378 0-2.58.237-3.606.71-1.026.474-1.823 1.146-2.392 2.015-.57.87-.854 1.908-.854 3.113 0 1.602.539 2.89 1.617 3.862 1.077.973 2.521 1.538 4.331 1.693l1.655.129c1.19.103 2.07.357 2.638.762.57.404.854.943.854 1.614 0 .534-.147 1.012-.44 1.434-.293.422-.741.762-1.345 1.02-.603.259-1.353.388-2.25.388-1 0-1.806-.146-2.418-.44-.612-.292-1.056-.675-1.332-1.149a2.871 2.871 0 01-.413-1.46H64c0 1.189.302 2.252.905 3.191.604.939 1.479 1.675 2.625 2.209 1.147.534 2.556.8 4.228.8zm14.51-.491v-6.562h1.526l4.706 6.562h4.06l-5.913-8.047 4.776-5.98h-3.75l-5.405 6.755V11.543h-3.595V30.4h3.595zm14.225 5.528c1.155 0 2.125-.138 2.91-.413a4.182 4.182 0 001.926-1.356c.5-.629.888-1.46 1.164-2.493l4.164-15.294h-3.44l-2.828 10.877h-.55l-3.422-10.877h-3.621l4.552 13.718h2.302l-.208.8c-.108.435-.259.792-.451 1.072l-.066.091c-.224.293-.504.5-.84.62-.337.12-.755.181-1.255.181h-2.637v3.074h2.301zm16.45-5.528V22.16c0-.913.27-1.64.814-2.183.543-.542 1.254-.814 2.134-.814.862 0 1.538.267 2.03.801.491.534.737 1.232.737 2.093V30.4h3.594v-8.034c0-2.136-.43-3.742-1.293-4.818-.862-1.077-2.129-1.615-3.801-1.615h-.155c-1.121 0-2.056.241-2.806.723-.75.483-1.315 1.202-1.694 2.158a6.718 6.718 0 00-.272.85l-.039.16v-3.451h-2.844v14.028h3.594zm19.655.49c1.156 0 2.186-.197 3.09-.593.906-.397 1.652-.956 2.238-1.68a5.946 5.946 0 001.19-2.531h-3.31c-.156.516-.51.951-1.061 1.304-.552.353-1.267.53-2.147.53-.879 0-1.603-.194-2.172-.581-.569-.388-.991-.922-1.267-1.602a5.601 5.601 0 01-.353-1.368l-.014-.117h10.556V22.96c0-1.24-.259-2.398-.776-3.475-.517-1.076-1.288-1.946-2.314-2.609s-2.298-.994-3.815-.994c-1.155 0-2.172.202-3.051.607a6.482 6.482 0 00-2.211 1.627 6.944 6.944 0 00-1.345 2.325 8.176 8.176 0 00-.453 2.7v.49c0 .896.151 1.774.453 2.636.301.86.75 1.64 1.345 2.337.594.698 1.344 1.253 2.25 1.667.905.413 1.96.62 3.167.62zm3.316-8.834h-7.058l.028-.15c.059-.284.135-.55.229-.8l.059-.148c.284-.68.702-1.201 1.254-1.563.552-.362 1.224-.543 2.017-.543.793 0 1.453.173 1.979.517.525.344.918.835 1.176 1.473.13.318.227.669.291 1.052l.025.162zm14.763 8.525v-3.075h-2.198c-.69 0-1.22-.185-1.59-.555-.371-.37-.557-.9-.557-1.589l.013-6.355h4.332v-2.635h-4.327l.008-3.952h-3.362l-.008 3.952h-2.242v2.635h2.237l-.013 6.123c0 1.292.187 2.332.56 3.12l.061.122c.414.8 1.039 1.37 1.875 1.705.836.336 1.9.504 3.194.504h2.017z"
                ></path>
              </g>
            </g>
          </svg>
          <button onClick={handleMySkyLogin} class="ui button">
            Login With MySky
          </button>
        </header>
      )}
    </div>
  );
}

export default App;
