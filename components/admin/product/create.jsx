"use client";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import PopupAlert from "../../alert/alert";
import axios from "axios";
const CreateProductComp = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    previewImage: null,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  //   product detail
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // loading state for fetching categoreis name and id
  const [loading1, setLoading1] = useState(false);
  const [categories, setCategories] = useState();
  const handleChange = (e) => {
    if (e.target.name === "image") {
      const selectedImage = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          image: selectedImage,
          previewImage: reader.result,
        });
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("profile-image-input");
    const file = fileInput.files[0];

    if (file && title && price && quantity) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "aafl5vm4");
      setLoading(true);

      try {
        // Make a request to Cloudinary to upload the image
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dzumurjj4/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        setProfileImage(data.secure_url);
        setPreviewImage(null);
        setLoading(false);
        // Save the profile image URL in local storage

        const post = await axios.post("/api/admin/product/product", {
          title: title,
          description: description,
          price: price,
          img: data.secure_url,
          category: category,
          quantity: quantity,
        });
        console.log(post);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        setLoading(false);
      }
    } else {
      setShowAlert(true);
    }
  };
  // show alert and hide alert functions
  const handleButtonClick = () => {
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };
  // useEffect for fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading1(true);
        const resp = await axios.get("/api/category/category");
        setCategories(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading1(false);
      }
    };

    fetchCategories();
  }, []);
  console.log(category);
  return (
    <div className="max-w-md mx-auto">
      {showAlert && (
        <PopupAlert
          message="make sure that you have selected price image and quantity of the product"
          onClose={handleAlertClose}
        />
      )}
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="blue"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      ) : (
        <div
          onSubmit={(e) => handleSubmit(e, user)}
          className="bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl mb-2">add title</h2>
          <div className="mb-4">
            <input
              value={title}
              placeholder="write the name of product"
              onChange={(e) => settitle(e.target.value)}
              className="w-full resize-none outline-blue-600 border-gray-300 border rounded p-2 mt-1"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-5"
          >
            <option disabled>Choose category</option>

            {loading ? (
              <option>Loading...</option>
            ) : (
              categories?.map((x, index) => (
                <option key={index} value={x?._id}>
                  {x?.title}
                </option>
              ))
            )}
          </select>

          <div className="mb-4">
            <textarea
              id="description"
              name="description"
              value={description}
              placeholder="write description here"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none outline-blue-600 border-gray-300 border rounded p-2 mt-1"
              rows={4}
            />
          </div>
          <h2 className="text-xl  mb-2">add price </h2>
          <div className="mb-4">
            <input
              value={price}
              placeholder="write price here"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full resize-none outline-blue-600 border-gray-300 border rounded p-2 mt-1"
            />
          </div>
          <h2 className="text-xl mb-2">add quantity of the product</h2>
          <div className="mb-4">
            <input
              value={quantity}
              placeholder="write the quantity of product"
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full resize-none outline-blue-600 border-gray-300 border rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="text-gray-700">
              Image
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className=" object-cover "
              />
            )}
            <form onSubmit={(e) => handleImagePreview(e)}>
              <input
                type="file"
                accept="image/*"
                id="profile-image-input"
                onChange={handleImagePreview}
              />
            </form>
          </div>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProductComp;