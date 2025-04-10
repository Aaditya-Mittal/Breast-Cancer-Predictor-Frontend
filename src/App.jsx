import React, { useState } from "react";
import { motion } from "framer-motion";

const featureOrder = [
  "radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean",
  "compactness_mean", "concavity_mean", "concave points_mean", "symmetry_mean", "fractal_dimension_mean",
  "radius_se", "texture_se", "perimeter_se", "area_se", "smoothness_se",
  "compactness_se", "concavity_se", "concave points_se", "symmetry_se", "fractal_dimension_se",
  "radius_worst", "texture_worst", "perimeter_worst", "area_worst", "smoothness_worst",
  "compactness_worst", "concavity_worst", "concave points_worst", "symmetry_worst", "fractal_dimension_worst"
];

const benignSample = {
  "radius_mean": 12.45, "texture_mean": 15.7, "perimeter_mean": 82.57, "area_mean": 477.1,
  "smoothness_mean": 0.1278, "compactness_mean": 0.17, "concavity_mean": 0.1578, "concave points_mean": 0.08089,
  "symmetry_mean": 0.2087, "fractal_dimension_mean": 0.07613, "radius_se": 0.2368, "texture_se": 1.158,
  "perimeter_se": 1.666, "area_se": 17.67, "smoothness_se": 0.008268, "compactness_se": 0.0381,
  "concavity_se": 0.03219, "concave points_se": 0.01431, "symmetry_se": 0.021, "fractal_dimension_se": 0.005701,
  "radius_worst": 13.6, "texture_worst": 22.88, "perimeter_worst": 87.52, "area_worst": 567.7,
  "smoothness_worst": 0.1555, "compactness_worst": 0.3594, "concavity_worst": 0.3689, "concave points_worst": 0.1744,
  "symmetry_worst": 0.3613, "fractal_dimension_worst": 0.1026
};

const malignantSample = {
  "radius_mean": 20.57, "texture_mean": 17.77, "perimeter_mean": 132.9, "area_mean": 1326,
  "smoothness_mean": 0.08474, "compactness_mean": 0.07864, "concavity_mean": 0.0869, "concave points_mean": 0.07017,
  "symmetry_mean": 0.1812, "fractal_dimension_mean": 0.05667, "radius_se": 0.5435, "texture_se": 0.7339,
  "perimeter_se": 3.398, "area_se": 74.08, "smoothness_se": 0.005225, "compactness_se": 0.01308,
  "concavity_se": 0.0186, "concave points_se": 0.0134, "symmetry_se": 0.01389, "fractal_dimension_se": 0.003532,
  "radius_worst": 25.38, "texture_worst": 17.33, "perimeter_worst": 184.6, "area_worst": 2019,
  "smoothness_worst": 0.1622, "compactness_worst": 0.6656, "concavity_worst": 0.7119, "concave points_worst": 0.2654,
  "symmetry_worst": 0.4601, "fractal_dimension_worst": 0.1189
};

function App() {
  const [inputs, setInputs] = useState(() =>
    Object.fromEntries(featureOrder.map((key) => [key, ""]))
  );
  const [result, setResult] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleExample = (value) => {
    const sample = value === "benign" ? benignSample : malignantSample;
    setInputs(sample);
    setResult({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = featureOrder.map((key) => parseFloat(inputs[key]));
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: values })
      });
      const data = await res.json();
      if (data.prediction === 1) {
        setResult({ text: "Malignant — High Risk", type: "danger" });
      } else {
        setResult({ text: "Benign — Low Risk", type: "success" });
      }
    } catch (err) {
      setResult({ text: "API Error. Check backend.", type: "error" });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <motion.div
        className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Breast Cancer Diagnosis Predictor
        </h1>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="text-gray-600 font-medium">Load Sample:</label>
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => handleExample(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="benign">Benign</option>
            <option value="malignant">Malignant</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featureOrder.map((feature) => (
              <div key={feature} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {feature}
                </label>
                <input
                  type="number"
                  name={feature}
                  step="any"
                  value={inputs[feature]}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Predict
          </button>
        </form>

        {result.text && (
          <motion.div
            className={`mt-6 p-4 rounded text-center font-semibold text-lg ${
              result.type === "success"
                ? "bg-green-100 text-green-700"
                : result.type === "danger"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {result.text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
