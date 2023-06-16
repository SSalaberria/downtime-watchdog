"use client";

import { useMutation } from "@apollo/client";
import { InputHTMLAttributes, forwardRef } from "react";

import { CreateTrackerDocument } from "../gql/documents.generated";

export const TrackerInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, _) => {
    const [createTracker] = useMutation(CreateTrackerDocument);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { websiteUrl } = event.target as typeof event.target & {
        websiteUrl: { value: string };
      };

      await createTracker({
        variables: { website: websiteUrl.value },
      });

      (event.target as HTMLFormElement).reset();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          id="websiteUrl"
          name="website-url"
          placeholder="https://www.google.com"
          type="url"
          {...props}
        />
      </form>
    );
  },
);

TrackerInput.displayName = "TrackerInput";
