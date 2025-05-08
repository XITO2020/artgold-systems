import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Déploiement des contrats avec le compte:", deployer.address);

  // Déployer AGTToken
  const AGTToken = await ethers.getContractFactory("AGTToken");
  const agtToken = await AGTToken.deploy();
  await agtToken.waitForDeployment();
  console.log("AGTToken déployé à:", await agtToken.getAddress());

  // Déployer TabAsCoin
  const TabAsCoin = await ethers.getContractFactory("TabAsCoin");
  const tabToken = await TabAsCoin.deploy();
  await tabToken.waitForDeployment();
  console.log("TabAsCoin déployé à:", await tabToken.getAddress());

  // Configuration des frais pour AGTToken (0.25%)
  await agtToken.setTransferFeeRate(25); // 0.25%
  await agtToken.setFeeCollector(deployer.address);
  console.log("AGTToken configuré avec frais de 0.25% et collecteur:", deployer.address);

  // Configuration des frais pour TabAsCoin (0.5%)
  await tabToken.setTransferFeeRate(50); // 0.5%
  await tabToken.setFeeCollector(deployer.address);
  console.log("TabAsCoin configuré avec frais de 0.5% et collecteur:", deployer.address);

  // Sauvegarder les adresses dans .env.local
  const envContent = `
NEXT_PUBLIC_AGT_CONTRACT_ADDRESS="${await agtToken.getAddress()}"
NEXT_PUBLIC_TAB_TOKEN_ADDRESS="${await tabToken.getAddress()}"
`;

  // Écrire dans .env.local (vous devrez le faire manuellement)
  console.log("\nAjoutez ces lignes à votre .env.local :");
  console.log(envContent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
