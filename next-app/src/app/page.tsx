"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "./constants";
import { AutoConnect } from "thirdweb/react";
import Link from "next/link";

export default function Home() {
  const account = useActiveAccount();

  return (
    <main className="h-screen w-full">
      <AutoConnect client={client} />
    </main>
  );
}
