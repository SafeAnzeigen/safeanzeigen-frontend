import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Switch } from "@headlessui/react";
import {
  InformationCircleIcon,
  CheckIcon,
  SelectorIcon,
  ExclamationIcon,
} from "@heroicons/react/solid";
import Head from "next/head";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";
import { format, set } from "date-fns";
import { Menu, Popover, Transition, Combobox } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";

let sliderCounter = 0;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Inserieren({
  adName,
  categoryName,
  subcategoryName,
  dateOfCreation,
  viewCount,
  location,
  price,
  priceType,
  imageURLArray,
  description,
  nameOfOwner,
  adID,
}) {
  const { asPath } = useRouter();
  const router = useRouter();
  const { user } = useUser();
  const clerkAuth = useAuth();
  const fileUpload = useRef(null);
  const componentRef = useRef();
  const canvasRef = useRef();
  const carouselRef = useRef();
  const hiddenFileInput = useRef(null);
  const hiddenVerificationFileInput = useRef(null);
  const [priceInput, setPriceInput] = useState(0);
  const [verificationImageSecureURL, setVerificationImageSecureURL] =
    useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [namePublic, setNamePublic] = useState(false);
  const [phoneNumberPublic, setPhoneNumberPublic] = useState(false);
  const [addressPublic, setAddressPublic] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState();
  const [subcategories, setSubcategories] = useState([]);
  const [query, setQuery] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [iscurrentlyUploading, setIscurrentlyUploading] = useState(false);
  const [
    iscurrentlyUploadingVerification,
    setIscurrentlyUploadingVerification,
  ] = useState(false);
  const [verificationQRCode, setVerificationQRCode] = useState("");
  const [validationSuccessToken, setValidationSuccessToken] = useState("");
  const [adImages, setAdImages] = useState([
    "/no-article-image.png",
    /* "https://res.cloudinary.com/dbldlm9vw/image/upload/v1653846501/safeanzeigen/a9uvqrwtezgrpikcztqd.png", */
    /* "https://res.cloudinary.com/dbldlm9vw/image/upload/v1653844890/safeanzeigen/ubj6rihex839xewfjpo1.jpg", */
    /* "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1328", */
  ]);

  const priceTypes = [
    { id: 1, priceTypeName: "VB" },
    { id: 2, priceTypeName: "Fix" },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
        fk_category_id: selectedCategoryData?.category_id,
        subcategory_id: selectedSubcategoryData?.subcategory_id,
        type: "sell",
        title: titleInputData,
        price: priceInputData,
        price_type: selectedPriceTypeData?.priceTypeName,
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
            data?.subcategories.map((element) => ({
              subcategory_id: element.subcategory_id,
              name: element.name,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("ERROR GET SUBCATEGORIES", error);
      });
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
            data?.categories.map((element) => ({
              category_id: element.category_id,
              name: element.name,
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
    console.log("COMPO", componentRef);
    console.log("COMPO2", componentRef?.current?.childNodes[0]);
    componentRef?.current?.childNodes[0].toBlob(function (blob) {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleVerificationButtonClick = (event) => {
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
        "https://api.cloudinary.com/v1_1/dbldlm9vw/image/upload" /* TODO: CHANGE THIS TO AUTO TO ENABLE VIDEO UPLOAD */,
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      if (adImages.length === 1 && adImages[0] === "/no-article-image.png") {
        setAdImages([data.secure_url]);
      } else {
        setAdImages([...adImages, data.secure_url]);
      }
      setIscurrentlyUploading(false);
      console.log("SECURE URL", data.secure_url);
    }
  };

  const uploadUserQRVerification = async (event) => {
    const fileUploaded = event.target.files[0];
    const formData = new FormData();

    if (fileUploaded) {
      formData.append("file", fileUploaded);

      formData.append("upload_preset", "safeanzeigenverify");

      setIscurrentlyUploadingVerification(true);
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dbldlm9vw/image/upload" /* TODO: CHANGE THIS TO AUTO TO ENABLE VIDEO UPLOAD */,
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
              verification_url: data.secure_url,
              verification_code: verificationQRCode,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("DATA VERIFICATION IMAGE DECODING", data);
            if (data.validationsuccesstoken) {
              setValidationSuccessToken(data.validationsuccesstoken);
            }
          })
          .catch((error) => {
            console.log("ERROR VERIFICATION IMAGE DECODING", error);
          });
      }
      setIscurrentlyUploadingVerification(false);
      console.log("SECURE URL VERIFICATION IMAGE", data.secure_url);
    }
  };

  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) => {
          return category.name.toLowerCase().includes(query.toLowerCase());
        });

  const filteredSubcategories =
    query === ""
      ? subcategories
      : subcategories.filter((subcategory) => {
          return subcategory.subcategoryName
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  const handleOnPreviousImageClick = () => {
    sliderCounter = (sliderCounter + 1) % adImages.length;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const handleOnNextImageClick = () => {
    const adImagesLength = adImages.length;
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
    /* retrieveSubCategories(); */
  }, []);

  useEffect(() => {
    retrieveSubCategoriesBelongingToCategory(selectedCategory?.name);
  }, [selectedCategory]);

  /*   categoryName = "Test";
  subcategoryName = "Test2"; */
  const testText =
    "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.";

  return (
    <div className="h-full bg-gray-50">
      <Head>
        <title>
          Safeanzeigen - Wir bringen Ihre Kleinanzeigen mit Sicherheit groß
          raus!
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
      </Head>
      {/* Navigation */}
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen">
            <div className="w-3/5 p-4 mx-auto mb-8 rounded-md select-none bg-blue-300/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="w-6 h-6 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                {console.log("selectedCategory", selectedCategory?.name)}
                <div className="flex-1 ml-3 md:flex md:justify-between">
                  <p className="font-semibold text-blue-900 text-md">
                    Dies ist eine Vorabsicht, wie deine Anzeige anderen Nutzern
                    angezeigt wird. Editiere deine Anzeige, um sie zu ändern und
                    bestimme welche Daten öffentlich sein sollen.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
              <div>
                <div ref={carouselRef} className="relative select-none">
                  {/* <div className="aspect-w-16 aspect-h-9"> */}
                  <img
                    src={adImages[carouselIndex]}
                    alt=""
                    layout="fill"
                    style={{
                      objectFit: "cover",
                      height: "800px",
                      width: "800px",
                    }}
                    className={`rounded-xl`}
                  />

                  {/*  </div> */}
                  {/* <div className="absolute flex items-center justify-center w-full px-3 transform top-1/2">
                      <button className="flex flex-col items-center px-4 py-3 ml-6 text-sm font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent">
                        <img src="/add.png" className="mb-2 w-9 h-9" />
                        <div className="text-lg font-extrabold">
                          Artikelbilder hochladen
                        </div>
                      </button>
                    </div> */}
                  {adImages.length > 1 &&
                    adImages[0] !== "/no-article-image.png" && (
                      <div
                        className={`${
                          adImages.length === 1
                            ? "cursor-pointer"
                            : "cursor-default"
                        } absolute flex items-center justify-between w-full px-3 transform -translate-y-1/2 top-1/2`}
                        onClick={() => {
                          if (adImages.length === 1) {
                          }
                        }}
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
                {console.log("ADIMAGEARRAY", adImages)}
                <div className="flex">
                  {adImages
                    .filter((imageURL) => imageURL !== "/no-article-image.png")
                    .map((imageURL, index) => (
                      <div
                        key={index}
                        className="relative p-4 mx-2 mt-2 border-orange-500 rounded-lg bg-blue-400/50"
                      >
                        {adImages.length > 1 && (
                          <div>
                            <div
                              onClick={() => {
                                setAdImages([
                                  ...adImages.filter(
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
                          style={{
                            objectFit: "cover",
                            height: "80px",
                            width: "80px",
                          }}
                        />
                      </div>
                    ))}
                </div>
                {/* <div className="flex justify-end">
                  <div className="flex p-2 mt-2 rounded-lg select-none bg-gray-200/75 blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="mx-2 text-gray-900">Anzahl Ansichten</span>
                  </div>
                  <div className="flex p-2 mt-2 ml-2 rounded-lg select-none bg-gray-200/75 blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="mx-2 text-gray-900">Anzahl Favorit</span>
                  </div>
                </div> */}
                <div>
                  <h2 className="mt-16 text-3xl font-bold text-center text-orange-500 break-words sm:text-4xl">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="w-full !text-3xl font-bold text-center outline-none focus:border-blue-300/50 text-orange-500 bg-white border-blue-300/50 rounded-md shadow-sm placeholder:text-orange-500 placeholder:font-bold placeholder:text-2xl focus:ring-0 select-none"
                      placeholder="Der Name deiner Kleinanzeige!"
                      value={titleInput}
                      onChange={(event) => {
                        setTitleInput(event.target.value);
                      }}
                    />
                  </h2>
                  <div className="px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center">
                    <div className="flex items-center justify-center mt-2 text-5xl font-extrabold text-gray-900">
                      <span className="w-1/5 mt-1 mr-3 text-xl font-medium text-gray-500">
                        <Combobox
                          as="div"
                          value={selectedPriceType}
                          onChange={setSelectedPriceType}
                          className="!z-50"
                        >
                          <div className="relative mt-1">
                            <Combobox.Input
                              className="w-full py-2 pl-3 pr-10 !text-xl font-extrabold text-white bg-[#2f70e9] border border-white rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-transparent sm:text-sm text-center"
                              onChange={(event) => setQuery(event.target.value)}
                              readOnly
                              displayValue={(priceType) =>
                                priceType?.priceTypeName
                              }
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                              <SelectorIcon
                                className="w-5 h-5 text-white"
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {priceTypes.length > 0 && (
                              <Combobox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto !text-xl !font-bold bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {priceTypes.map((priceType) => (
                                  <Combobox.Option
                                    key={priceType.id}
                                    value={priceType}
                                    className={({ active }) =>
                                      classNames(
                                        "relative cursor-pointer select-none py-2 pl-8 pr-4",
                                        active
                                          ? "bg-[#2f70e9] text-white"
                                          : "text-gray-900"
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            "block truncate",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {priceType.priceTypeName}
                                        </span>

                                        {selected && (
                                          <span
                                            className={classNames(
                                              "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            )}
                                          >
                                            <CheckIcon
                                              className="w-5 h-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            )}
                          </div>
                        </Combobox>
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
                    {/*  <div className="relative">
                      <div className="mt-6 opacity-50 select-none blur">
                        <div className="rounded-md shadow">
                          <a
                            href="#"
                            className="flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md cursor-default"
                          >
                            Kontakt aufnehmen
                          </a>
                        </div>
                        <div className="mt-4 rounded-md shadow cursor-default">
                          <a
                            href="#"
                            className="flex items-center justify-center px-5 py-3 text-base font-medium text-gray-700 bg-white border-gray-300 rounded-md cursor-default"
                          >
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            Favorisieren / Entfavorisieren
                          </a>
                        </div>

                        <div className="mt-4 rounded-md shadow">
                          <span
                            onClick={() => {
                              typeof window !== "undefined"
                                ? copyToClipboard(window.location)
                                : "";
                            }}
                            className="flex items-center justify-center px-5 py-3 text-base font-medium text-gray-700 bg-white border-gray-300 rounded-md cursor-default"
                          >
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
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                            Teilen
                          </span>
                        </div>
                      </div>
                      <div className="absolute left-0 z-30 float-left w-full px-2 py-1 text-lg font-bold text-black rounded-lg select-none bg-gray-200/50 top-20">
                        Hier werden Nutzer mit deiner Anzeige interagieren
                        können.
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white sm:rounded-lg lg:ml-10">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-orange-500">
                    Anbieter
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Informationen zum Anbieter
                  </p>
                </div>
                {console.log("USER", user)}
                <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Identicon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`https://source.boringavatars.com/beam/300/${user?.id}${user?.id}${user?.id}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
                          alt="Benutzeridentifizierender Avatar"
                        />
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                            <span className="sr-only">Use setting</span>
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
                            {namePublic ? "Privat" : "Öffentlich"}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Mitglied seit
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 select-none sm:mt-0 sm:col-span-2">
                        {format(user?.createdAt, "dd.MM.yyyy")}
                      </dd>
                    </div>
                    <div className="py-5 md:px-6 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-orange-500">
                        Anzeige
                      </h3>
                      <p className="max-w-2xl mt-1 text-sm text-gray-500">
                        Informationen zur Anzeige
                      </p>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Kategorie
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                        <Combobox
                          as="div"
                          value={selectedCategory}
                          onChange={setSelectedCategory}
                        >
                          <Combobox.Label className="block text-sm font-normal text-gray-700">
                            Kategorie auswählen
                          </Combobox.Label>
                          <div className="relative mt-1">
                            <Combobox.Input
                              className="w-full py-2 pl-3 pr-10 text-gray-60 border border-white rounded-md shadow-sm focus:outline-none focus:ring-transparent sm:text-sm !text-lg font-bold text-white !bg-[#2f70e9] cursor-pointer"
                              onChange={(event) => setQuery(event.target.value)}
                              displayValue={(category) => category?.name}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                              <SelectorIcon
                                className="w-5 h-5 text-white"
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {filteredCategories.length > 0 && (
                              <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredCategories.map((category) => (
                                  <Combobox.Option
                                    key={category.category_id}
                                    value={category}
                                    className={({ active }) =>
                                      classNames(
                                        "relative cursor-pointer select-none py-2 pl-8 pr-4",
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            "block truncate",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {category.name}
                                        </span>

                                        {selected && (
                                          <span
                                            className={classNames(
                                              "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            )}
                                          >
                                            <CheckIcon
                                              className="w-5 h-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            )}
                          </div>
                        </Combobox>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subkategorie
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <Combobox
                          as="div"
                          value={selectedSubcategory}
                          onChange={setSelectedSubcategory}
                          className={`${!selectedCategory ? "invisible" : ""}`}
                        >
                          <Combobox.Label className="block text-sm text-gray-700 font-base">
                            Subkategorie auswählen
                          </Combobox.Label>
                          <div className="relative mt-1">
                            <Combobox.Input
                              className="w-full py-2 pl-3 pr-10 border border-white rounded-md shadow-sm focus:outline-none focus:ring-transparent sm:text-sm !text-lg font-bold text-white !bg-[#2f70e9] cursor-pointer"
                              onChange={(event) => setQuery(event.target.value)}
                              displayValue={(subcategory) => subcategory?.name}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                              <SelectorIcon
                                className="w-5 h-5 text-white"
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {filteredSubcategories.length > 0 && (
                              <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredSubcategories.map((subcategory) => (
                                  <Combobox.Option
                                    key={subcategory.subcategory_id}
                                    value={subcategory}
                                    className={({ active }) =>
                                      classNames(
                                        "relative select-none py-2 pl-8 pr-4 cursor-pointer",
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            "block truncate",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {subcategory.name}
                                        </span>

                                        {selected && (
                                          <span
                                            className={classNames(
                                              "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            )}
                                          >
                                            <CheckIcon
                                              className="w-5 h-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            )}
                          </div>
                        </Combobox>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Telefonnummer
                      </dt>
                      <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
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
                            <span className="sr-only">Use setting</span>
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
                            {phoneNumberPublic ? "Privat" : "Öffentlich"}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Adresse
                      </dt>
                      <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div
                          className={`${
                            addressPublic
                              ? "blur-sm !select-none cursor-default"
                              : ""
                          } mr-2`}
                        >
                          <input
                            type="text"
                            name="locationInput"
                            id="locationInput"
                            disabled={addressPublic ? true : false}
                            className={`${
                              addressPublic ? "!select-none" : ""
                            } block w-full border-gray-300 placeholder:text-white bg-[#2f70e9] text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Straße, Hausnummer, PLZ, Ort"
                            value={locationInput}
                            onChange={(event) =>
                              setLocationInput(event.target.value)
                            }
                          />
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
                              <span className="sr-only">Use setting</span>
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
                            <span className="ml-2 font-bold text-[#2f70e9] text-base select-none">
                              {addressPublic ? "Privat" : "Öffentlich"}
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
                          rows={testText.split("\n").length}
                          name="comment"
                          id="comment"
                          className="block w-full mt-1 font-semibold text-gray-700 rounded-md cursor-default resize-none sm:text-sm focus:border-gray-700 focus:ring-0 h-96"
                          placeholder="Erkläre den deinem zukünftigen Käufer genau, was deinen Artikel ausmacht."
                          value={descriptionInput}
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
                <div className="w-3/5 p-4 mx-auto my-8 rounded-md select-none bg-yellow-300/50">
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
                        Folgend möchten wir verifizieren, dass du den
                        angebotenen Artikel wirklich besitzt. Dieser Check hilft
                        auch dir, um authentische Angebote zu finden. Bitte
                        drucke folgenden QR-Code aus oder legen ein Gerät auf
                        welchem dieser angezeigt wird neben den Artikel und lade
                        ein Bild davon hoch. Wir überprüfen die Korrektheit
                        deines QR-Codes maschinell und ggf. manuell die
                        Sichtbarkeit deines Artikels neben diesem. Bietest du
                        eine Dienstleistung an, so lege QR-Code neben deine
                        Flyer oder Werbung. Der QR-Code ist eine Stunde gültig.
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
                      alt=""
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
                <div className="flex justify-center mb-4">
                  <div className="p-2 mr-4 border-2 rounded-lg border-orange-500/50">
                    {/* <div className="text-center">Verifikations-QR-Code</div> */}
                    {/* <img
                    src={adImages[carouselIndex]}
                    alt=""
                    layout="fill"
                    style={{
                      objectFit: "cover",
                      height: "200px",
                      width: "200px",
                    }}
                    className={`rounded-xl`}
                  /> */}
                    {console.log("verificationQRCode", verificationQRCode)}
                    <div ref={componentRef}>
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
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 mt-4"
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
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent m-2 mt-4"
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
                  <div className="p-2 border-2 rounded-lg border-orange-500/50">
                    {/* <div className="text-center">Artikel neben dem QR-Code</div> */}
                    <img
                      src="/scan-verification-example.png"
                      alt=""
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

            {(adImages.length < 3 ||
              !titleInput ||
              !priceInput ||
              !selectedPriceType ||
              !descriptionInput ||
              !validationSuccessToken) && (
              <div className="flex justify-center">
                <ul className="w-3/5 p-4 mt-8 text-white list-disc rounded-lg bg-red-700/75">
                  Es fehlen noch folgende Dinge, um die Anzeige zu
                  veröffentlichen:
                  {adImages.length < 3 && (
                    <li className="ml-4">
                      Mindestens 3 hochwertige Fotos deines Artikels
                    </li>
                  )}
                  {!selectedCategory > 0 && (
                    <li className="ml-4">
                      Mindestens eine Kategorie der Anzeige ausgewählt
                    </li>
                  )}
                  {!titleInput && <li className="ml-4">Name des Inserates</li>}
                  {!priceInput && <li className="ml-4">Preis</li>}
                  {!selectedPriceType && (
                    <li className="ml-4">Preistyp (Fix oder VB)</li>
                  )}
                  {!locationInput && (
                    <li className="ml-4">
                      Die Angabe der Adresse für das Inserat
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
                adImages.length < 3 ||
                !titleInput ||
                !priceInput ||
                !selectedPriceType ||
                !locationInput ||
                !descriptionInput ||
                !validationSuccessToken
                  ? "blur-[2px] select-none !cursor-default"
                  : "cursor-pointer hover:bg-[#2962cd] hover:text-orange-500"
              }`}
            >
              <button className="w-3/5 flex flex-col items-center mx-6 text-sm font-medium bg-[#2f70e9] border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent mt-4 text-orange-400 py-4">
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

                <div
                  onClick={() => {
                    if (
                      adImages.length >= 3 &&
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
                  className="text-xl font-extrabold !text-white"
                >
                  Anzeige Veröffentlichen
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
