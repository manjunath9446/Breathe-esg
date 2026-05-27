import React from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../api";

export default function Review() {
  const queryClient =
    useQueryClient();

  const {
    data: records = [],
    isLoading,
  } = useQuery({
    queryKey: ["review"],

    queryFn: async () => {
      const res = await api.get(
        "/emissions/?review_status__in=PENDING,FLAGGED"
      );

      return res.data;
    },
  });

  const approveMutation =
    useMutation({
      mutationFn: (id) =>
        api.patch(
          `/emissions/${id}/approve/`
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          ["review"]
        );
      },
    });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Analyst Review Desk
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Raw Value
              </th>

              <th className="p-4 text-left">
                CO2e
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-t"
              >
                <td className="p-4">
                  {
                    record.activity_type
                  }
                </td>

                <td className="p-4">
                  {
                    record.activity_value
                  }{" "}
                  {
                    record.activity_unit
                  }
                </td>

                <td className="p-4 font-bold">
                  {record.co2e}
                </td>

                <td className="p-4">
                  {
                    record.review_status
                  }
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      approveMutation.mutate(
                        record.id
                      )
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}