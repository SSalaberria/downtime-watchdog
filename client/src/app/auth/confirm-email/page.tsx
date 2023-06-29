"use client";

import { useMutation } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { LoadingIcon } from "~/common/ui";
import { VerifyMailDocument } from "~/features/auth/gql/documents.generated";

export default function ConfirmEmailPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [verifyMail, { loading, error, data }] = useMutation(VerifyMailDocument, {
    onCompleted() {
      push("/");
      toast.success("Mail has been succesfully verified.");
    },
  });

  useEffect(() => {
    verifyMail({
      variables: {
        token: searchParams.get("token")!,
      },
    });
  }, [searchParams, verifyMail]);

  return (
    <div className="flex h-1/2 items-center justify-center">
      {(loading || data) && <LoadingIcon className="w-12 stroke-gray-500" />}
      {error && <p className="pb-1 text-center text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
