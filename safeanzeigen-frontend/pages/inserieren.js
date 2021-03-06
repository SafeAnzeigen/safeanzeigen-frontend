import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useReactToPrint } from "react-to-print";
import { QRCodeCanvas } from "qrcode.react";
import { Transition, Listbox, Switch } from "@headlessui/react";
import { format } from "date-fns";
import {
  InformationCircleIcon,
  SelectorIcon,
  ExclamationIcon,
} from "@heroicons/react/solid";

import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";

let sliderCounter = 0;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Inserieren() {
  const router = useRouter();
  const { user } = useUser();
  const clerkAuth = useAuth();

  const componentRef = useRef();
  const canvasRef = useRef();
  const carouselRef = useRef();
  const hiddenFileInput = useRef(null);
  const hiddenVerificationFileInput = useRef(null);

  const [locationInput, setLocationInput] = useState("");
  const [priceInput, setPriceInput] = useState(0);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [namePublic, setNamePublic] = useState(false);
  const [phoneNumberPublic, setPhoneNumberPublic] = useState(false);
  const [addressPublic, setAddressPublic] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Elektronik");
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState();
  const [subcategories, setSubcategories] = useState([]);
  const priceTypes = ["VB", "Fix"];
  const [selectedPriceType, setSelectedPriceType] = useState(priceTypes[0]);

  const [iscurrentlyUploading, setIscurrentlyUploading] = useState(false);
  const [
    iscurrentlyUploadingVerification,
    setIscurrentlyUploadingVerification,
  ] = useState(false);
  const [verificationImageSecureURL, setVerificationImageSecureURL] =
    useState("");
  const [verificationQRCode, setVerificationQRCode] = useState("");
  const [validationSuccessToken, setValidationSuccessToken] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [adImages, setAdImages] = useState(["/no-article-image.png"]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function umlautConverter(word) {
    word = word.toLowerCase();
    word = word.replace(/??/g, "ae");
    word = word.replace(/??/g, "oe");
    word = word.replace(/??/g, "ue");
    word = word.replace(/??/g, "ss");
    word = word.replace(/ /g, "-");
    word = word.replace(/\./g, "");
    word = word.replace(/,/g, "");
    word = word.replace(/\(/g, "");
    word = word.replace(/\)/g, "");
    return word;
  }

  const addAdvertisement = async (
    userData,
    titleInputData,
    adImagesArray,
    priceInputData,
    selectedPriceTypeData,
    selectedCategoryData,
    selectedSubcategoryData /* TODO: ADD SUBCATEGORY TO DB SCHEMA */,
    locationInputData,
    descriptionInputData,
    validationSuccessTokenData,
    namePublicData,
    addressPublicData,
    phoneNumberPublicData
  ) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/advertisements/`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${await clerkAuth.getToken()}`,
      },
      body: JSON.stringify({
        clerk_user_id: userData?.id,
        category_name: selectedCategoryData,
        subcategory_name: selectedSubcategoryData,
        type: "sell",
        title: titleInputData,
        price: priceInputData,
        price_type: selectedPriceTypeData,
        description: descriptionInputData,
        verification_image: verificationImageSecureURL,
        verification_qr_code: verificationQRCode,
        validation_success_token: validationSuccessTokenData,
        is_verified: true,
        article_image_1: adImagesArray[0],
        article_image_2: adImagesArray[1],
        article_image_3: adImagesArray[2],
        article_image_4: adImagesArray[3],
        article_image_5: adImagesArray[4],
        article_video: "",
        show_name: !namePublicData,
        show_address: !addressPublicData,
        show_phone: !phoneNumberPublicData,
        show_user_photo: true,
        location_street: locationInputData,
        location_street_number: "private",
        location_city: "private",
        location_zip: "private",
        location_county: "private",
        location_country: "private",
        view_count: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA ADD ADVERTISEMENT", data);
        if (data?.advertisement_id) {
          router.push(`/angebote`);
        }
      })
      .catch((error) => {
        console.log("ERROR ADD ADVERTISEMENT", error);
      });
  };

  const retrieveSubCategoriesBelongingToCategory = async (category_name) => {
    if (category_name) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/subcategories/categoryname/${category_name}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA GET SUBCATEGORIES", data);
          if (data?.subcategories) {
            setSubcategories(
              data?.subcategories?.map((element) => ({
                subcategory_id: element?.subcategory_id,
                name: element?.name,
              }))
            );
          }
        })
        .catch((error) => {
          console.log("ERROR GET SUBCATEGORIES", error);
        });
    }
  };

  const retrieveCategories = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/categories/`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${await clerkAuth.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA GET CATEGORIES", data);
        if (data?.categories) {
          setCategories(
            data?.categories?.map((element) => ({
              category_id: element?.category_id,
              name: element?.name,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("ERROR GET CATEGORIES", error);
      });
  };

  const generateVerificationQRCode = async (userData) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
        `/advertisements/verificationimage/generate/${userData.id}/`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA VERIFICATION QR CODE", data);
        if (data?.token) {
          setVerificationQRCode(data?.token);
        }
      })
      .catch((error) => {
        console.log("ERROR VERIFICATION QR CODE", error);
      });
  };

  const copyQRCodeCanvasToClipboard = () => {
    componentRef?.current?.childNodes[0].toBlob(function (blob) {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
      alert("Das Bild des QR-Codes wurde zum Versenden f??r dich kopiert.");
    });
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleVerificationButtonClick = () => {
    hiddenVerificationFileInput.current.click();
  };

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    const formData = new FormData();

    if (fileUploaded) {
      formData.append("file", fileUploaded);

      formData.append("upload_preset", "safeanzeigen");

      setIscurrentlyUploading(true);
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_PUBLIC_API_URL}` /* TODO: CHANGE THIS TO AUTO TO ENABLE VIDEO UPLOAD */,
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      if (adImages?.length === 1 && adImages[0] === "/no-article-image.png") {
        setAdImages([data?.secure_url]);
      } else {
        setAdImages([...adImages, data?.secure_url]);
      }
      setIscurrentlyUploading(false);
      console.log("SECURE URL", data?.secure_url);
    }
  };

  const success = (position) => {
    /* console.log("POSITION SUCCESS", position); */
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoAPIURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    fetch(geoAPIURL)
      .then((res) => res.json())
      .then((data) => {
        /* console.log("GEO DATA", data); */
        const locality = data?.locality;
        const postcode = data?.postcode;
        setLocationInput(data?.locality);
      });
  };

  const error = (position) => {
    console.log("POSITION ERROR", position);
    alert("Bitte gebe das Recht frei deinen Standort zu nutzen");
  };

  const uploadUserQRVerification = async (event) => {
    const fileUploaded = event.target.files[0];
    const formData = new FormData();

    if (fileUploaded) {
      formData.append("file", fileUploaded);

      formData.append("upload_preset", "safeanzeigenverify");

      setIscurrentlyUploadingVerification(true);
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_PUBLIC_API_URL}` /* TODO: CHANGE THIS TO AUTO TO ENABLE VIDEO UPLOAD */,
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      if (data?.secure_url) {
        setVerificationImageSecureURL(data?.secure_url);
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
            `/advertisements/verificationimage/validate/${user.id}/`,
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `${await clerkAuth.getToken()}`,
            },
            body: JSON.stringify({
              verification_url: data?.secure_url,
              verification_code: verificationQRCode,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("DATA VERIFICATION IMAGE DECODING", data);
            if (data?.validationsuccesstoken) {
              setValidationSuccessToken(data.validationsuccesstoken);
            }
          })
          .catch((error) => {
            console.log("ERROR VERIFICATION IMAGE DECODING", error);
          });
      }
      setIscurrentlyUploadingVerification(false);
      console.log("SECURE URL VERIFICATION IMAGE", data?.secure_url);
    }
  };

  const handleOnPreviousImageClick = () => {
    sliderCounter = (sliderCounter + 1) % adImages?.length;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const handleOnNextImageClick = () => {
    const adImagesLength = adImages?.length;
    sliderCounter = (carouselIndex + adImagesLength - 1) % adImagesLength;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const removeAnimation = () => {
    carouselRef.current.classList.remove("carousel-flash-animation");
  };

  useEffect(() => {
    window.onscroll = function () {};
    carouselRef.current.addEventListener("animationend", removeAnimation);
    generateVerificationQRCode(user);
    retrieveCategories();
  }, []);

  useEffect(() => {
    retrieveSubCategoriesBelongingToCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="h-full bg-gray-50">
      <Head>
        <title>
          Safeanzeigen - Wir bringen Ihre Kleinanzeigen mit Sicherheit gro??
          raus!
        </title>
        <meta
          name="description"
          content="Wir bringen deine Kleinanzeigen mit Sicherheit gro?? raus"
        />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen">
            <div className="w-full p-4 mx-auto mb-8 rounded-md select-none md:w-3/5 bg-blue-300/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="w-6 h-6 text-blue-400"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex-1 ml-3 md:flex md:justify-between">
                  <p className="font-semibold text-blue-900 text-md">
                    Dies ist eine Vorabsicht, wie deine Anzeige anderen Nutzern
                    angezeigt wird. Editiere deine Anzeige, um sie zu ??ndern und
                    bestimme welche Daten ??ffentlich sein sollen.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
              <div>
                <div ref={carouselRef} className="relative select-none">
                  <img
                    src={adImages[carouselIndex]}
                    alt="Hochgeladenes Bild der Kleinanzeige"
                    layout="fill"
                    style={{
                      objectFit: "cover",
                      height: "800px",
                      width: "800px",
                    }}
                    className={`rounded-xl`}
                  />

                  {adImages?.length > 1 &&
                    adImages[0] !== "/no-article-image.png" && (
                      <div
                        className={`${
                          adImages?.length === 1
                            ? "cursor-pointer"
                            : "cursor-default"
                        } absolute flex items-center justify-between w-full px-3 transform -translate-y-1/2 top-1/2`}
                      >
                        <button onClick={() => handleOnPreviousImageClick()}>
                          <div className="p-2 bg-orange-400 rounded-full hover:bg-orange-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                              />
                            </svg>
                          </div>
                        </button>
                        <button onClick={() => handleOnNextImageClick()}>
                          <div className="p-2 bg-orange-400 rounded-full hover:bg-orange-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>
                    )}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleClick()}
                    type="button"
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 mt-4"
                  >
                    {iscurrentlyUploading ? (
                      <svg
                        className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx={12}
                          cy={12}
                          r={10}
                          stroke="currentColor"
                          strokeWidth={4}
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    )}
                    Bild Hochladen
                  </button>
                  <input
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                  />
                </div>

                <div className="flex">
                  {adImages
                    ?.filter((imageURL) => imageURL !== "/no-article-image.png")
                    ?.map((imageURL, index) => (
                      <div
                        key={index}
                        className="relative p-4 mx-2 mt-2 border-orange-500 rounded-lg bg-blue-400/50"
                      >
                        {adImages?.length > 1 && (
                          <div>
                            <div
                              onClick={() => {
                                setAdImages([
                                  ...adImages?.filter(
                                    (element) => element !== imageURL
                                  ),
                                ]);
                              }}
                              title="Bild entfernen"
                              className="absolute p-1 text-white transition-transform duration-300 transform rounded-full cursor-pointer select-none hover:scale-105 hover:bg-gray-200 bg-black/50 top-2 right-2 hover:text-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </div>
                            {index !== 0 && (
                              <div
                                onClick={() => {
                                  const tempImageURLAtIndex = adImages[index];
                                  setAdImages([adImages.splice(index, 1)]);
                                  setAdImages([
                                    tempImageURLAtIndex,
                                    ...adImages,
                                  ]);
                                }}
                                title="Bild an 1. Stelle bringen"
                                className="absolute p-1 text-white transition-transform duration-300 transform rounded-full cursor-pointer hover:scale-105 hover:bg-gray-200 bg-black/50 left-2 bottom-2 hover:text-yellow-500"
                              >
                                <svg
                                  id="Line"
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  enableBackground="new 0 0 32 32"
                                  height="512"
                                  viewBox="0 0 32 32"
                                  width="512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    id="XMLID_330_"
                                    d="m29.568 11.177c-.337-.233-.782-.235-1.123-.009l-5.227 3.484-6.428-8.266c-.198-.253-.502-.399-.827-.386-.321.012-.617.177-.795.445l-5.482 8.223-6.189-3.537c-.344-.196-.773-.172-1.093.065-.319.237-.467.641-.378 1.028l3 13c.104.455.508.776.974.776h20c.466 0 .87-.321.975-.775l3-13c.091-.399-.069-.815-.407-1.048zm-4.363 12.823h-18.41l-.462-2h19.332zm.923-4h-20.256l-1.384-5.998 5.016 2.866c.457.262 1.036.123 1.328-.313l5.23-7.846 6.148 7.905c.322.415.909.509 1.344.218l3.905-2.603z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                        <img
                          className="select-none rounded-xl"
                          src={imageURL}
                          layout="fill"
                          alt="Kleine Thumbnail ??bersicht des hochgeladenen Bildes"
                          style={{
                            objectFit: "cover",
                            height: "80px",
                            width: "80px",
                          }}
                        />
                      </div>
                    ))}
                </div>

                <div>
                  <input
                    type="text"
                    className="w-full !text-3xl font-bold text-center outline-none focus:border-blue-300/50 text-orange-500 bg-white border-blue-300/50 rounded-md shadow-sm placeholder:text-orange-500 placeholder:font-bold placeholder:text-2xl focus:ring-0 mt-16 "
                    placeholder="NAME HINZUF??GEN"
                    maxLength="55"
                    value={titleInput}
                    onChange={(event) => setTitleInput(event.target.value)}
                  />
                  <div className="text-center md:px-6 bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center">
                    <div className="flex items-center justify-center mt-2 text-5xl font-extrabold text-gray-900">
                      <span className="w-1/5 mt-1 mr-3 text-xl font-medium text-gray-500">
                        <Listbox
                          value={selectedPriceType}
                          onChange={setSelectedPriceType}
                        >
                          <div className="relative mt-1">
                            <Listbox.Button className="relative md:w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-lg font-bold text-white !bg-[#2f70e9]">
                              <span className="block truncate">
                                {selectedPriceType}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon
                                  className="w-5 h-5 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {priceTypes?.map((priceType, index) => (
                                  <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                      `relative cursor-pointer font-extrabold select-none py-2 text-center text-base ${
                                        active
                                          ? "bg-[#2f70e9] text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={priceType}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate font-bold`}
                                        >
                                          {priceType}
                                        </span>
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </span>
                      <div className="flex">
                        <div className="mt-2">
                          <input
                            type="text"
                            name="preis"
                            id="preis"
                            className="block border-gray-300 bg-[#2f70e9] text-white rounded-md shadow-sm sm:text-sm placeholder:text-white placeholder:font-bold placeholder:text-xl !font-bold !text-xl w-24 no-number-input-indications text-right"
                            placeholder={0}
                            maxLength={5}
                            value={priceInput}
                            onChange={(event) => {
                              setPriceInput(event.target.value);
                            }}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </div>
                        <div className="mt-3 ml-1 text-3xl">{",00"}</div>
                      </div>

                      <span className="mt-2 ml-3 text-xl font-medium text-gray-500">
                        EURO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white sm:rounded-lg lg:ml-10">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-xl font-medium leading-6 text-orange-500 md:text-lg">
                    Anbieter
                  </h3>
                  <p className="max-w-2xl mt-1 text-base text-gray-500 md:text-sm">
                    Informationen zum Anbieter
                  </p>
                </div>

                <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-lg font-medium text-gray-500 md:text-sm">
                        Identicon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <img
                          className="w-16 h-16 rounded-full md:w-10 md:h-10"
                          src={`https://source.boringavatars.com/beam/300/${user?.id}${user?.id}${user?.id}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
                          alt="Benutzeridentifizierender Avatar"
                        />
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-lg font-medium text-gray-500 md:text-sm">
                        Name
                      </dt>
                      <dd className="flex justify-between mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2 md:text-sm">
                        <span
                          className={`${
                            namePublic ? "blur-sm select-none" : ""
                          } mr-2`}
                        >
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span>
                          <Switch
                            checked={namePublic}
                            onChange={setNamePublic}
                            className={classNames(
                              namePublic ? "bg-[#2f70e9]" : "bg-gray-200",
                              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
                            )}
                          >
                            <span
                              className={classNames(
                                namePublic ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                              )}
                            >
                              <span
                                className={classNames(
                                  namePublic
                                    ? "opacity-0 ease-out duration-100"
                                    : "opacity-100 ease-in duration-200",
                                  "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                )}
                                aria-hidden="true"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 12 12"
                                >
                                  <path
                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span
                                className={classNames(
                                  namePublic
                                    ? "opacity-100 ease-in duration-200"
                                    : "opacity-0 ease-out duration-100",
                                  "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                )}
                                aria-hidden="true"
                              >
                                <svg
                                  className="w-3 h-3 text-indigo-600"
                                  fill="currentColor"
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </Switch>
                          <span className="ml-2 font-bold text-[#2f70e9] text-base select-none">
                            {namePublic ? "Privat" : "??ffentlich"}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-lg font-medium text-gray-500 md:text-sm ">
                        Mitglied seit
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 select-none md:text-sm sm:mt-0 sm:col-span-2">
                        {format(user?.createdAt, "dd.MM.yyyy")}
                      </dd>
                    </div>
                    <div className="py-5 md:px-6 sm:px-0">
                      <h3 className="text-xl font-medium leading-6 text-orange-500 md:text-lg">
                        Anzeige
                      </h3>
                      <p className="max-w-2xl mt-1 text-base text-gray-500 md:text-sm">
                        Informationen zur Anzeige
                      </p>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Kategorie
                      </dt>
                      <div className="mt-1 text-lg font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                        <Listbox
                          value={selectedCategory}
                          onChange={(category) => {
                            setSelectedCategory(category);
                            setSelectedSubcategory();
                          }}
                        >
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-lg font-bold text-white !bg-[#2f70e9] min-h-12">
                              <span className="block truncate">
                                {selectedCategory}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon
                                  className="w-5 h-5 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-50">
                                {categories
                                  ?.sort((a, b) =>
                                    a?.name.localeCompare(b?.name)
                                  )
                                  ?.map((category, index) => (
                                    <Listbox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative select-none py-2 cursor-pointer pl-10 pr-4 font-bold ${
                                          active
                                            ? "bg-[#2f70e9] text-white"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={category?.name}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate font-bold`}
                                          >
                                            {category?.name}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subkategorie
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <Listbox
                          value={selectedSubcategory}
                          onChange={setSelectedSubcategory}
                        >
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-lg font-bold text-white !bg-[#2f70e9] min-h-12">
                              <span className="block truncate">
                                {selectedSubcategory}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon
                                  className="w-5 h-5 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-50">
                                {subcategories
                                  ?.sort((a, b) =>
                                    a?.name.localeCompare(b?.name)
                                  )
                                  ?.map((subcategory, index) => (
                                    <Listbox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative select-none py-2 cursor-pointer pl-10 pr-4 font-bold ${
                                          active
                                            ? "bg-[#2f70e9] text-white"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={subcategory?.name}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate font-bold`}
                                          >
                                            {subcategory?.name}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-lg font-medium text-gray-500 md:text-sm">
                        Telefonnummer
                      </dt>
                      <dd className="flex justify-between mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2 md:text-sm">
                        <span
                          className={`${
                            phoneNumberPublic ? "blur-sm select-none" : ""
                          } mr-2`}
                        >
                          {user?.phoneNumbers[0]?.phoneNumber}
                        </span>
                        <span>
                          <Switch
                            checked={phoneNumberPublic}
                            onChange={setPhoneNumberPublic}
                            className={classNames(
                              phoneNumberPublic
                                ? "bg-[#2f70e9]"
                                : "bg-gray-200",
                              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
                            )}
                          >
                            <span
                              className={classNames(
                                phoneNumberPublic
                                  ? "translate-x-5"
                                  : "translate-x-0",
                                "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                              )}
                            >
                              <span
                                className={classNames(
                                  phoneNumberPublic
                                    ? "opacity-0 ease-out duration-100"
                                    : "opacity-100 ease-in duration-200",
                                  "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                )}
                                aria-hidden="true"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 12 12"
                                >
                                  <path
                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span
                                className={classNames(
                                  phoneNumberPublic
                                    ? "opacity-100 ease-in duration-200"
                                    : "opacity-0 ease-out duration-100",
                                  "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                )}
                                aria-hidden="true"
                              >
                                <svg
                                  className="w-3 h-3 text-indigo-600"
                                  fill="currentColor"
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </Switch>
                          <span className="ml-2 font-bold text-[#2f70e9] text-base select-none">
                            {phoneNumberPublic ? "Privat" : "??ffentlich"}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-lg font-medium text-gray-500 md:text-sm">
                        Stadt des Inserats
                      </dt>
                      <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div
                          className={`${
                            addressPublic
                              ? "blur-sm !select-none cursor-default"
                              : ""
                          }`}
                        >
                          <div className="flex w-48">
                            <input
                              type="text"
                              maxLength="30"
                              name="locationInput"
                              id="locationInput"
                              disabled={addressPublic ? true : false}
                              className={`${
                                addressPublic ? "!select-none" : ""
                              } block w-3/5 border-gray-300 placeholder:text-white bg-[#2f70e9] text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                              placeholder="Stadt"
                              value={locationInput}
                              onChange={(event) =>
                                setLocationInput(
                                  umlautConverter(event.target.value)
                                )
                              }
                            />
                            {!addressPublic && (
                              <div
                                onClick={() =>
                                  navigator.geolocation.getCurrentPosition(
                                    success,
                                    error
                                  )
                                }
                                className="mb-1 mr-2 text-gray-500 cursor-pointer hover:text-orange-500"
                                title="Meinen Standort nutzen"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-8 h-8 my-1 ml-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        {locationInput && (
                          <span className="mt-2">
                            <Switch
                              checked={addressPublic}
                              onChange={(event) => {
                                if (locationInput) {
                                  setAddressPublic(event);
                                }
                              }}
                              className={classNames(
                                addressPublic ? "bg-[#2f70e9]" : "bg-gray-200",
                                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
                              )}
                            >
                              <span
                                className={classNames(
                                  addressPublic
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                )}
                              >
                                <span
                                  className={classNames(
                                    addressPublic
                                      ? "opacity-0 ease-out duration-100"
                                      : "opacity-100 ease-in duration-200",
                                    "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                  )}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="w-3 h-3 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 12 12"
                                  >
                                    <path
                                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <span
                                  className={classNames(
                                    addressPublic
                                      ? "opacity-100 ease-in duration-200"
                                      : "opacity-0 ease-out duration-100",
                                    "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                                  )}
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="w-3 h-3 text-indigo-600"
                                    fill="currentColor"
                                    viewBox="0 0 12 12"
                                  >
                                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                  </svg>
                                </span>
                              </span>
                            </Switch>
                            <span className="font-bold text-[#2f70e9] text-base select-none ml-2">
                              {addressPublic ? "Privat" : "??ffentlich"}
                            </span>
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="h-full py-5 md:px-6">
                      <h3 className="text-lg font-medium leading-6 text-orange-500">
                        Beschreibung
                      </h3>
                      <div className="grow-wrap">
                        <textarea
                          spellCheck="false"
                          name="comment"
                          id="comment"
                          className="block w-full mt-1 font-semibold text-gray-700 rounded-md cursor-default resize-none sm:text-sm focus:border-gray-700 focus:ring-0 h-96"
                          placeholder="Erkl??re den deinem zuk??nftigen K??ufer genau, was deinen Artikel ausmacht."
                          value={descriptionInput}
                          maxLength="1500"
                          onChange={(event) =>
                            setDescriptionInput(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <div>
              {validationSuccessToken ? (
                ""
              ) : (
                <div className="w-full p-4 mx-auto my-8 rounded-md select-none md:w-3/5 bg-yellow-300/50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ExclamationIcon
                        className="w-6 h-6 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 ml-3 md:flex md:justify-between">
                      <p className="font-semibold text-blue-900 text-md">
                        <span className="font-bold text-center">
                          ARTIKELVERIFIKATION
                        </span>
                        <br />
                        Folgend m??chten wir verifizieren, dass du den
                        angebotenen Artikel wirklich besitzt. Dieser Check hilft
                        auch dir, um authentische Angebote zu finden. Bitte
                        drucke folgenden QR-Code aus oder legen ein Ger??t auf
                        welchem dieser angezeigt wird neben den Artikel und lade
                        ein Bild davon hoch. Wir ??berpr??fen die Korrektheit
                        deines QR-Codes maschinell und ggf. manuell die
                        Sichtbarkeit deines Artikels neben diesem. Bietest du
                        eine Dienstleistung an, so lege QR-Code neben deine
                        Flyer oder Werbung. Der QR-Code ist eine Stunde g??ltig.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {validationSuccessToken ? (
                <div className="my-8 select-none">
                  <div className="flex justify-center">
                    <img
                      src="/success-badge.png"
                      alt="Indikator f??r eine erfolgreiche Verifikation"
                      layout="fill"
                      style={{
                        objectFit: "cover",
                        height: "200px",
                        width: "200px",
                      }}
                      className={`rounded-xl m-4 bg-green-500/50 p-2`}
                    />
                  </div>
                  <div className="font-semibold text-center text-gray-700">
                    Du hast deinen Artikel erfolgreich verifiziert!
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center mb-4 md:flex-row">
                  <div className="p-2 mb-4 border-2 rounded-lg md:mr-4 border-orange-500/50 md:mb-0">
                    <div className="flex justify-center" ref={componentRef}>
                      <QRCodeCanvas
                        value={verificationQRCode}
                        size={220}
                        includeMargin={true}
                        id="qrcode"
                        ref={canvasRef}
                      />
                    </div>
                    <div className="flex justify-around">
                      <button
                        onClick={handlePrint}
                        type="button"
                        className="md:inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 mt-4 w-2/6 flex justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => copyQRCodeCanvasToClipboard()}
                        type="button"
                        className="md:inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 mt-4 w-2/6 flex justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="w-full p-2 mx-auto border-2 rounded-lg border-orange-500/50 md:mx-0 md:w-64">
                    <div className="flex flex-col items-center justify-center md:flex-none">
                      <img
                        src="/scan-verification-example.png"
                        alt="Erkl??rung f??r die Verifikation"
                        layout="fill"
                        style={{
                          objectFit: "cover",
                          height: "200px",
                          width: "200px",
                        }}
                        className={`rounded-xl m-4`}
                      />
                      <button
                        onClick={() => handleVerificationButtonClick()}
                        type="button"
                        className="inline-flex px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 ml-4"
                      >
                        {iscurrentlyUploadingVerification ? (
                          <svg
                            className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx={12}
                              cy={12}
                              r={10}
                              stroke="currentColor"
                              strokeWidth={4}
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                        )}
                        Bild Hochladen
                      </button>
                    </div>
                    <input
                      ref={hiddenVerificationFileInput}
                      onChange={uploadUserQRVerification}
                      type="file"
                      name="file"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {(adImages?.length < 3 ||
              !titleInput ||
              !priceInput ||
              !selectedPriceType ||
              !descriptionInput ||
              !validationSuccessToken) && (
              <div className="flex justify-center">
                <ul className="w-full p-4 mt-8 text-white list-disc rounded-lg md:w-3/5 bg-red-700/75">
                  Es fehlen noch folgende Dinge, um die Anzeige zu
                  ver??ffentlichen:
                  {adImages?.length < 3 && (
                    <li className="ml-4">
                      Mindestens 3 hochwertige Fotos deines Artikels
                    </li>
                  )}
                  {!selectedCategory > 0 && (
                    <li className="ml-4">
                      Mindestens eine Kategorie der Anzeige ausgew??hlt
                    </li>
                  )}
                  {!titleInput && <li className="ml-4">Name des Inserates</li>}
                  {!priceInput && <li className="ml-4">Preis</li>}
                  {!selectedPriceType && (
                    <li className="ml-4">Preistyp (Fix oder VB)</li>
                  )}
                  {!locationInput && (
                    <li className="ml-4">
                      Die Angabe der Adresse f??r das Inserat
                    </li>
                  )}
                  {!descriptionInput && (
                    <li className="ml-4">
                      Eine umfassende Beschreibung deines Artikels
                    </li>
                  )}
                  {!validationSuccessToken && (
                    <li className="ml-4">Eine Artikelverifikation</li>
                  )}
                </ul>
              </div>
            )}
            <div
              className={`flex justify-center ${
                adImages?.length < 3 ||
                !titleInput ||
                !priceInput ||
                !selectedPriceType ||
                !locationInput ||
                !descriptionInput ||
                !validationSuccessToken
                  ? "blur-[2px] select-none !cursor-default"
                  : "cursor-pointer  hover:text-orange-500"
              }`}
            >
              <button
                onClick={() => {
                  if (
                    adImages?.length >= 3 &&
                    titleInput &&
                    priceInput &&
                    selectedPriceType &&
                    selectedCategory &&
                    locationInput &&
                    descriptionInput &&
                    validationSuccessToken
                  ) {
                    addAdvertisement(
                      user,
                      titleInput,
                      adImages,
                      priceInput,
                      selectedPriceType,
                      selectedCategory,
                      selectedSubcategory,
                      locationInput,
                      descriptionInput,
                      validationSuccessToken,
                      namePublic,
                      addressPublic,
                      phoneNumberPublic
                    );
                  }
                }}
                className={`${
                  adImages?.length >= 3 &&
                  titleInput &&
                  priceInput &&
                  selectedPriceType &&
                  selectedCategory &&
                  locationInput &&
                  descriptionInput &&
                  validationSuccessToken
                    ? "cursor-pointer hover:bg-[#2962cd]"
                    : "cursor-not-allowed"
                } md:w-3/5 flex flex-col items-center md:mx-6 text-sm font-medium bg-[#2f70e9]  border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent mt-4 text-orange-400 py-4 w-full`}
              >
                <svg
                  id="Layer_1"
                  enableBackground="new 0 0 512 512"
                  height="512"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                >
                  <path
                    clipRule="evenodd"
                    d="m496 234.858h-480c-8.837 0-16 7.164-16 16v215.014c0 8.836 7.163 16 16 16h480c8.837 0 16-7.164 16-16v-215.014c0-8.837-7.163-16-16-16zm-16 215.014h-448v-183.014h448zm-306.183-35.684v-111.646c0-8.836 7.163-16 16-16s16 7.164 16 16v111.646c0 8.836-7.163 16-16 16s-16-7.164-16-16zm-101.373 0v-111.646c0-8.836 7.163-16 16-16s16 7.164 16 16v95.646h36.625c8.837 0 16 7.164 16 16s-7.163 16-16 16h-52.625c-8.837 0-16-7.164-16-16zm283.188 0v-111.646c0-8.836 7.163-16 16-16h51.924c8.837 0 16 7.164 16 16s-7.163 16-16 16h-35.924v23.823h20.186c8.837 0 16 7.164 16 16s-7.163 16-16 16h-20.186v23.823h35.924c8.837 0 16 7.164 16 16s-7.163 16-16 16h-51.924c-8.837 0-16-7.164-16-16zm-123.273-106.676c-2.745-8.399 1.838-17.434 10.237-20.179 8.396-2.746 17.435 1.838 20.179 10.238l21.282 65.116 21.284-65.116c2.744-8.399 11.777-12.985 20.179-10.237 8.399 2.745 12.982 11.78 10.237 20.179l-36.492 111.646c-2.15 6.579-8.287 11.029-15.208 11.029-6.922 0-13.058-4.451-15.208-11.029zm-85.161-209.753c-6.249-6.249-6.249-16.379 0-22.627 29.02-29.02 67.658-45.002 108.799-45.003 41.142-.001 79.783 15.981 108.805 45.003 6.249 6.248 6.249 16.379 0 22.627-6.248 6.248-16.379 6.248-22.627 0-22.978-22.978-53.583-35.632-86.178-35.631-32.593 0-63.196 12.655-86.172 35.63-3.124 3.125-7.219 4.687-11.313 4.687s-8.19-1.562-11.314-4.686zm146.853 48.123c-20.981-20.981-55.121-20.981-76.103 0-3.124 3.124-7.219 4.686-11.313 4.686-4.096 0-8.189-1.562-11.313-4.687-6.249-6.249-6.249-16.379 0-22.627 33.46-33.458 87.9-33.457 121.356 0 6.249 6.249 6.249 16.379 0 22.627-6.248 6.25-16.379 6.25-22.627.001zm-38.05 17.107c10.851 0 19.701 8.85 19.701 19.701s-8.85 19.701-19.701 19.701-19.701-8.85-19.701-19.701c0-10.85 8.851-19.701 19.701-19.701z"
                    fillRule="evenodd"
                    fill="currentColor"
                  />
                </svg>

                <div className="text-xl font-extrabold !text-white">
                  Anzeige Ver??ffentlichen
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
