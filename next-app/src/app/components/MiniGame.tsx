import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getBalance } from "thirdweb/extensions/erc20";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "../constants";
import { name } from "thirdweb/extensions/common";

interface Monster {
  health: number;
  maxHealth: number;
  type: "goblin" | "golem" | "wizard" | "darkKnight" | "darkDragon";
  reward: number;
}

const monsterType = [
  {
    type: "goblin",
    name: "Goblin",
    minHealth: 30,
    maxHealth: 60,
    reward: 3,
    image: "/goblin.png",
  },
  {
    type: "golem",
    name: "Golem",
    minHealth: 61,
    maxHealth: 75,
    reward: 5,
    image: "/golem.png",
  },
  {
    type: "wizard",
    name: "Wizard",
    minHealth: 76,
    maxHealth: 85,
    reward: 7,
    image: "/wizard.png",
  },
  {
    type: "darkKnight",
    name: "DarkKnight",
    minHealth: 86,
    maxHealth: 95,
    reward: 10,
    image: "/darkKnight.png",
  },
  {
    type: "darkDragon",
    name: "DarkDragon",
    minHealth: 96,
    maxHealth: 100,
    reward: 15,
    image: "/darkDragon.png",
  },
];

const MiniGame: React.FC = () => {
  const address = useActiveAccount()?.address;
  const [energy, setEnergy] = useState(30);
  const [monster, setMonster] = useState<Monster | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0x9eF1764AbaF386499FcE1ffD91c4054e12C8D93c",
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract(
    getBalance,
    { contract: contract, address: address as string }
  );

  const generateMonster = () => {
    const health = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
    const monsterType = monsterTypes.find(
      (m) => health >= m.minHealth && health <= m.maxHealth
    )!;
    setMonster({
      health,
      maxHealth: health,
      type: monsterType.type as
        | "goblin"
        | "golem"
        | "wizard"
        | "darkKnight"
        | "darkDragon",
      reward: monsterType.reward,
    });
    setCurrentReward(monsterType.reward);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 30));
    }, 1000);
    if (!monster) {
      generateMonster();
    }
    return () => clearInterval(timer);
  }, [monster]);

  const handleClick = () => {
    if (energy > 0 && monster) {
      setEnergy((prevEnergy) => prevEnergy - 1);
      const newHealth = monster.health - 1;
      if (newHealth <= 0) {
        setShowReward(true);
      } else {
        setMonster({ ...monster, health: newHealth });
      }
    }
  };

  const handleRewardClaim = async () => {
    if (!address || isClaiming) return;
    setIsClaiming(true);
    try {
      const response = await fetch("/api/mintToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWalletAddress: address,
          amount: currentReward,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Claim successful:", result);
        setShowReward(false);
        generateMonster();
      } else if (response.status === 408) {
      }
    } catch {}
  };
};
