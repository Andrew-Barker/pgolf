import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getClaims } from "./utils/helper";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const navigation = [
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Scorecard", href: "/scorecard" },
  { name: "Course", href: "/course" },
  { name: "Players", href: "/players" },
  { name: "Rules", href: "/rules" },
  { name: "Sign In", href: "/sign-in" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header2() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();
  const [navigationState, setNavigationState] = useState(navigation);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // set the user
        console.log("User is logged in:", user);
        getClaims(auth).then((adminStatus) => {
          setIsAdmin(adminStatus);
        });
      } else {
        setCurrentUser(null); // reset the user
        console.log("User is logged out");
      }
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  // Then create an effect to update the navigationState when currentUser or isAdmin change
  useEffect(() => {
    let updatedNavigation = [...navigation];

    if (currentUser) {
      updatedNavigation = updatedNavigation.filter(
        (item) => item.name !== "Sign In"
      );
    }

    if (!isAdmin) {
      updatedNavigation = updatedNavigation.filter(
        (item) => item.href !== "/players"
      );
    }

    setNavigationState(updatedNavigation);
  }, [currentUser, isAdmin]);

  // useEffect(() => {
  //   console.log('is there a user?', auth)
  //   getClaims(auth).then((adminStatus) => {
  //     setIsAdmin(adminStatus);
  //   });
  // }, [auth.currentUser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => (window.location.href = "/"))
      .catch((error) => console.error("Error signing out:", error));
  };

  const handleNavClick = (index) => {
    const updatedNavigation = navigationState.map((item, i) => ({
      ...item,
      current: i === index,
    }));
    console.log(`updated nav`, updatedNavigation);
    setNavigationState(updatedNavigation);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex items-center text-white">
  {/* For mobile view */}
  <div className="lg:hidden">
    <span className="text-2xl font-bold">Pub Golf</span>
  </div>

  {/* For desktop view */}
  <div className="hidden lg:flex">
    <span className="text-3xl font-bold">Pub Golf</span>
  </div>
</div>


                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigationState.map((item, index) => {
                      if (item.href === "/players" && !isAdmin) {
                        return null;
                      }

                      if (
                        item.href === "/sign-in" &&
                        auth.currentUser // use currentUser instead of auth.currentUser
                      ) {
                        return null;
                      }

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => handleNavClick(index)}
                          className={classNames(
                            item.href === location.pathname
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={
                            item.href === location.pathname ? "page" : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {auth.currentUser && (
                <>
                  {/* Profile dropdown */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={handleSignOut}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item, index) => {
                if (item.href === "/players" && !isAdmin) {
                  return null;
                }

                if (
                  item.href === "/sign-in" &&
                  auth.currentUser // use currentUser instead of auth.currentUser
                ) {
                  return null;
                } else {
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.href === location.pathname
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={
                        item.href === location.pathname ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                }
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
