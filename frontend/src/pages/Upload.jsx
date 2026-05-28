import React, { useState } from "react";
import api from "../api";

export default function Upload() {

  const [sourceSystem, setSourceSystem] =
    useState("SAP");

  const [fileUrl, setFileUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleUpload = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    setError("");

    try {

      const payload = {
        source_system: sourceSystem,
        file_url: fileUrl,
      };

      console.log("Payload:", payload);

      const response = await api.post(
      "/batches/",
      payload
      );

      console.log(response.data);

      setMessage(
        "File uploaded and queued successfully!"
      );

      setFileUrl("");

    } catch (err) {

      console.error(err);

      console.log(
        err?.response?.data
      );

      setError(
        JSON.stringify(
          err?.response?.data
        ) || err.message
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <div
        style={{
          maxWidth: "700px",
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >

        <h1
          style={{
            fontSize: "48px",
            marginBottom: "40px",
          }}
        >
          Data Ingestion Pipeline
        </h1>

        <form onSubmit={handleUpload}>

          <div style={{ marginBottom: "25px" }}>

            <label>
              Source System
            </label>

            <select
              value={sourceSystem}
              onChange={(e) =>
                setSourceSystem(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
              }}
            >

              <option value="SAP">
                SAP ERP
              </option>

              <option value="UTILITY">
                Utility
              </option>

              <option value="TRAVEL">
                Travel
              </option>

            </select>

          </div>

          <div style={{ marginBottom: "30px" }}>

            <label>
              File URL
            </label>

            <input
              type="text"
              value={fileUrl}
              onChange={(e) =>
                setFileUrl(
                  e.target.value
                )
              }
              placeholder="Paste CSV URL"
              required
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
              }}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding:
                "14px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            {
              loading
                ? "Uploading..."
                : "Start Ingestion"
            }
          </button>

        </form>

        {
          message && (
            <p
              style={{
                marginTop: "25px",
                color: "green",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )
        }

        {
          error && (
            <p
              style={{
                marginTop: "25px",
                color: "red",
                fontWeight: "bold",
                whiteSpace: "pre-wrap",
              }}
            >
              Error: {error}
            </p>
          )
        }

      </div>

    </div>
  );
}