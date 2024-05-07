import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Layout from "../../components/layouts/Layout";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllBrands } from "../../features/brand/brandSlice";
import { fetchAllCategories } from "../../features/category/categorySlice";
import { fetchAllProducts } from "../../features/product/productSlice";
import SlideShowWidget from "./components/SlideShowWidget";
import CategoryWidget from "./components/CategoryWidget";
import BrandWidget from "./components/BrandWidget";
import ProductWidget from "./components/ProductWidget";
import FeaturedBrand from "./components/FeaturedBrand";
import FeaturedCategories from "./components/FeaturedCategories";
import { addWidgetValidation } from "../../validations/addWidgetValidation";
import {
  addWidget,
  fetchAllwidget,
  fetchWidgetById,
  updateWidget,
} from "../../features/widget/homeWidgetSlice";
import { toast } from "react-toastify";

const EditHomeWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [showButton, setShowButton] = useState(false);
  const [widgetType, setWidgetType] = useState(" ");
  const [showItemForm, setShowItemForm] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catOption, setCatOption] = useState([]);
  const [products, setProducts] = useState([]);
  const [prodOption, setProdOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [destinationId, setDestinationId] = useState([]);
  const [featuredBrandProducts, setFeaturedBrandProducts] = useState([]);
  const [featuredCategoryProducts, setFeaturedCategoryProducts] = useState([]);
  const [homeWidgets, setHomeWidgets] = useState([]);
  const [widgetPositions, setWidgetPositions] = useState([]);
  const [widget, setWidget] = useState({});

  const initialValues = {
    placement_id: widget.placement_id,
    title: widget.title,
    widget_type: widget.widget_type,
  };

  //   get brands
  const brandOptions = [];
  const fetchBrand = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setBrands(res);
    res?.map((brand) => {
      brandOptions.push({ label: brand.name, value: brand.id });
    });

    setBrandOption(brandOptions);
  };

  const catOptions = [];
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
    //  console.log(res)
    setCategories(res);
    res?.map((cat) => {
      catOptions.push({ label: cat.name, value: cat.id });
    });

    setCatOption(catOptions);
  };

  const prodOptions = [];
  const fetchProducts = async () => {
    const res = await dispatch(fetchAllProducts()).unwrap();
    //  console.log(res)
    setProducts(res);

    res?.map((prod) => {
      prodOptions.push({ label: prod.name, value: prod.id });
    });

    setProdOption(prodOptions);
  };

  let positions = [
    { name: "position 1", value: "1" },
    { name: "position 2", value: "2" },
    { name: "position 3", value: "3" },
    { name: "position 4", value: "4" },
    { name: "position 5", value: "5" },
    { name: "position 6", value: "6" },
    { name: "position 7", value: "7" },
    { name: "position 8", value: "8" },
    { name: "position 9", value: "9" },
    { name: "position 10", value: "10" },
  ];

  const fetchWidgets = async () => {
    const res = await dispatch(fetchAllwidget()).unwrap();
    //  console.log('widget',res)
    setHomeWidgets(res);
    setWidgetPositions(positions);
    res.forEach((widget) => {
      //   console.log(widget.placement_id)
      const index = positions.findIndex(
        (position) => position.value === widget.placement_id
      );
      // console.log(position.value);

      //   console.log(index);
      // If a match is found, remove it from the positions array
      if (index !== -1) {
        positions.splice(index, 1);
        setWidgetPositions(positions);
      }

      //   console.log('positions',positions)
    });
  
  };

  const fetchWidget = async () => {
    try {
      const res = await dispatch(fetchWidgetById({ id })).unwrap();
      console.log(res);
      setWidget(res);
      if (res) {
        positions.push({
          name: `Position ${res.placement_id}`,
          value: res.placement_id,
        });
        setWidgetPositions(positions);
        setWidgetType(res.widget_type);
        setShowItemForm(true);
        setShowButton(true);
      }
      initialValues.placement_id = res.placement_id;
      initialValues.title = res.title;
      initialValues.widget_type = res.widget_type;
      initialValues.items = res.items
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBrand();
    fetchCategory();
    fetchProducts();
    fetchWidgets();
    fetchWidget();
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Submitting form with values:", values);

    setSubmitting(false);

    const res = await dispatch(updateWidget({id,  values})).unwrap();
    if (res) {
      toast.success("Widget updated successfully!");
      navigate("/homePage");
    }
  };

  const handleWidgetChange = async (e) => {
    await setWidgetType(e.target.value);

    // console.log("Selected Widget:", selectedValue);
    // console.log(brands);

    // Show the button when a specific value is selected
    if (widgetType) {
      setShowItemForm(true);
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleAddItem = (values, setFieldValue) => {
    setShowItemForm(true);
    setItems(values.item);
    // const newItems = [
    //   ...values.items,
    //   {
    //     image: '',
    //     description: '',
    //     tag: '',
    //     brand: '',
    //     destination: '',
    //     id: '',
    //     index: values.items.length,
    //   },
    // ];
    // console.log('New Items:', newItems);
    // setFieldValue('items', newItems);
  };

  const handleDestinationChange = (e) => {
    setDestinationOptions([]);
    if (e.target.value === "product") {
      setDestinationOptions(prodOption);
    } else if (e.target.value === "category") {
      setDestinationOptions(catOption);
    } else if (e.target.value === "brand") {
      setDestinationOptions(brandOption);
    } else {
      setDestinationOptions([]);
    }
  };

  const handleFeaturedCategoryChange = (e) => {
    const featuredCategoryOptions = [];
    products?.map((prod) => {
      if (prod.categories.includes(e.target.value)) {
        featuredCategoryOptions.push({ label: prod.name, value: prod.id });
      }
    });
    setFeaturedCategoryProducts(featuredCategoryOptions);
  };

  const handleFeaturedBrandChange = (e) => {
    const featuredBrandOptions = [];
    products?.map((prod) => {
      if (prod.brand_id === e.target.value) {
        featuredBrandOptions.push({ label: prod.name, value: prod.id });
      }
    });
    setFeaturedBrandProducts(featuredBrandOptions);
  };

  const handleSelectIdChange = (fieldName, selectedOption, setFieldValue) => {
    setFieldValue(fieldName, selectedOption.value);
    console.log(selectedOption);
    // setDestinationId(selectedOption)
  };

  const moveItem = (values, fromIndex, toIndex) => {
    const itemsCopy = [...values.items];
    const [movedItem] = itemsCopy.splice(fromIndex, 1);
    itemsCopy.splice(toIndex, 0, movedItem);

    // Update the index of all items
    const updatedItems = itemsCopy.map((item, index) => ({ ...item, index }));
    values.items = updatedItems;
    console.log(values.items);
    return updatedItems;
  };

  // const moveItem = (values, fromIndex, toIndex) => {
  //   const itemsCopy = [...values.items];

  //   // Remove the item from the array at the fromIndex
  //   const [movedItem] = itemsCopy.splice(fromIndex, 1);

  //   // Insert the moved item at the toIndex
  //   itemsCopy.splice(toIndex, 0, movedItem);

  //   // Update the index and id of all items
  //   const updatedItems = itemsCopy.map((item, index) => ({
  //     ...item,
  //     index,
  //     id: item.id,
  //   }));

  //   return updatedItems;
  // };

  const onDragEnd = (result, values, setFieldValue) => {
    if (!result.destination) return;
    console.log(result);

    const widgetItems = [...values.items];
    const [removed] = widgetItems.splice(result.source.index, 1);
    widgetItems.splice(result.destination.index, 0, removed);

    values.items = widgetItems;
    console.log(values);
  };

  // const onDragEnd = (result, values, setFieldValue) => {
  //   if (!result.destination) return;

  //   const { source, destination } = result;

  //   if (source.index !== destination.index) {
  //     // Reorder items
  //     const reorderedItems = Array.from(values.items);
  //     const [removed] = reorderedItems.splice(source.index, 1);
  //     reorderedItems.splice(destination.index, 0, removed);

  //     // Update IDs and images based on reordered items
  //     reorderedItems.forEach((item, index) => {
  //       setFieldValue(`items.${index}.id`, item.id); // Update ID
  //       setFieldValue(`items.${index}.image`, item.image); // Update image
  //     });
  //     console.log("Reordered Items:", reorderedItems);
  //     values.items = reorderedItems
  //     // setFieldValue('items', reorderedItems);
  //     console.log("Formik Values:", values);
  //   }
  // };

  return (
    <Layout>
      {/* <DndProvider backend={HTML5Backend}> */}
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
            <h4>Edit Home Widget</h4>
            <Formik
              initialValues={initialValues}
              validationSchema={addWidgetValidation}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, { setSubmitting });
              }}
            >
              {({ values, errors, isSubmitting, setFieldValue, field }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="placement_id" className="form-label">
                      Placement:
                    </label>
                    <Field
                      as="select"
                      id="placement_id"
                      name="placement_id"
                      className="form-select"
                    >
                      <option value="">Select Position</option>
                      {widgetPositions?.map((pos) => {
                        return (
                          <option value={pos.value} key={pos.value}>
                            {pos.name}
                          </option>
                        );
                      })}
                      {/* <option value="p1">Position 1</option>
                      <option value="p2">Position 2</option>
                      <option value="p3">Position 3</option>
                      <option value="p4">Position 4</option>
                      <option value="p5">Position 5</option>
                      <option value="p6">Position 6</option>
                      <option value="p7">Position 7</option>
                      <option value="p8">Position 8</option>
                      <option value="p9">Position 9</option>
                      <option value="p10">Position 10</option> */}
                      {/* Add more options as needed */}
                    </Field>
                    {/* <ErrorMessage name="placement_id" component="div" /> */}
                    {errors.placement_id && (
                      <p className="text-danger">{errors.placement_id}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      aria-describedby="titleHelp"
                    ></Field>
                    {errors.title && (
                      <p className="text-danger">{errors.title}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subtitle" className="form-label">
                      Subtitle
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="subtitle"
                      name="subtitle"
                      aria-describedby="subtitleHelp"
                    ></Field>
                    {errors.subtitle && (
                      <p className="text-danger">{errors.subtitle}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="widget_type" className="form-label">
                      Widget Type:
                    </label>
                    <Field
                      as="select"
                      id="widget_type"
                      name="widget_type"
                      className="form-select"
                      onChange={(e) => {
                        handleWidgetChange(e);
                        setFieldValue("widget_type", e.target.value);
                        setFieldValue("items", []);
                      }}
                    >
                      <option value="">Select Widget</option>
                      <option value="slideshow">Slide Show</option>
                      <option value="categories">Categories</option>
                      <option value="brands">Brands</option>
                      <option value="products">Products</option>
                      <option value="featured_categories">
                        Featured Categories
                      </option>
                      <option value="featured_brand">Featured Brand</option>
                    </Field>
                    {/* <ErrorMessage name="widget_type" component="div" /> */}
                    {errors.widget_type && (
                      <p className="text-danger">{errors.widget_type}</p>
                    )}
                  </div>

                  {/* items selection according to widget selection */}
                  <>
                    {widgetType === "slideshow" && showItemForm && (
                      <SlideShowWidget
                        values={values}
                        brands={brands}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        destinationOptions={destinationOptions}
                        handleAddItem={handleAddItem}
                        handleSelectIdChange={handleSelectIdChange}
                        handleDestinationChange={handleDestinationChange}
                      />
                    )}
                    {widgetType === "categories" && showItemForm && (
                      <CategoryWidget
                        values={values}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        categories={categories}
                        handleAddItem={handleAddItem}
                      />
                    )}
                    {widgetType === "brands" && showItemForm && (
                      <BrandWidget
                        values={values}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        brands={brands}
                        handleAddItem={handleAddItem}
                      />
                    )}
                    ,
                    {widgetType === "products" && showItemForm && (
                      <ProductWidget
                        values={values}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        productOptions={prodOption}
                        handleAddItem={handleAddItem}
                        handleSelectIdChange={handleSelectIdChange}
                      />
                    )}
                    {widgetType === "featured_brand" && showItemForm && (
                      <FeaturedBrand
                        values={values}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        productOptions={prodOption}
                        featuredBrandProducts={featuredBrandProducts}
                        brands={brands}
                        handleAddItem={handleAddItem}
                        handleFeaturedBrandChange={handleFeaturedBrandChange}
                      />
                    )}
                    {widgetType === "featured_categories" && showItemForm && (
                      <FeaturedCategories
                        values={values}
                        setFieldValue={setFieldValue}
                        onDragEnd={onDragEnd}
                        showButton={showButton}
                        productOptions={prodOption}
                        featuredCategoryProducts={featuredCategoryProducts}
                        categories={categories}
                        handleAddItem={handleAddItem}
                        handleFeaturedCategoryChange={
                          handleFeaturedCategoryChange
                        }
                      />
                    )}
                    <ErrorMessage
                      name="items"
                      className="text-danger"
                      component="div"
                    />
                    <button
                      type="submit"
                      className="btn btn-sm btn-success mt-4"
                    >
                      Update
                    </button>
                  </>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* </DndProvider> */}
    </Layout>
  );
};

export default EditHomeWidget;