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

function Menu() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <MenuItem
        title="Sponsored transactions"
        href="/gasless"
        description="Execute transactions without requiring users to hold ETH."
      />
      <MenuItem
        title="Pay"
        href="/pay"
        description="Allow users to purchase NFT's using fiat"
      />
    </div>
  );
}

function MenuItem(props: { title: string; href: string; description: string }) {
  return (
    <Link
      href={props.href}
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </Link>
  );
}
