"use client";

import { useMutation } from "@apollo/client";
import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { AddIcon, LoadingIcon } from "~/common/ui";

import { CreateTrackerDocument } from "../gql/documents.generated";

export const TrackerInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, _) => {
    const [createTracker, { loading, error }] = useMutation(CreateTrackerDocument, {
      update(cache, { data }) {
        cache.modify({
          fields: {
            userDashboard(existingDashboard) {
              return {
                ...existingDashboard,
                trackers: data?.addTrackerToDashboard.trackers,
              };
            },
          },
        });
      },
      onError(error) {
        console.error(error);
      },
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { websiteUrl } = event.target as typeof event.target & {
        websiteUrl: { value: string };
      };

      createTracker({
        variables: { website: websiteUrl.value },
      });

      (event.target as HTMLFormElement).reset();
    };

    return (
      <form className="relative flex flex-col items-center gap-2" onSubmit={handleSubmit}>
        <input
          required
          autoComplete="off"
          className={twMerge(className, "pr-8")}
          disabled={loading}
          id="websiteUrl"
          name="website-url"
          placeholder="https://www.google.com"
          type="url"
          {...props}
        />
        <button className="absolute right-3 top-3" disabled={props?.disabled} id="add-tracker-btn">
          {loading ? (
            <LoadingIcon className=" w-5 stroke-gray-500" />
          ) : (
            <AddIcon className="w-5 stroke-gray-500 hover:stroke-gray-400" />
          )}
        </button>

        {error && <p className="text-red-500">{error.message.split(":")[2]}</p>}
      </form>
    );
  },
);

TrackerInput.displayName = "TrackerInput";
