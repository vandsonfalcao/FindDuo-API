import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const games = [
		{
      title: "Apex Legends",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/511224-188x250.jpg",
		},
		{
      title: "Valorant",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/516575-188x250.jpg",
		},
		{
      title: "COD: Warzone",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/512710-188x250.jpg",
		},
		{
      title: "Fortnite",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/33214-188x250.jpg",
		},
		{
      title: "Minecraft",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/27471_IGDB-188x250.jpg",
		},
		{
      title: "League of Legends",
			bannerUrl: "https://static-cdn.jtvnw.net/ttv-boxart/21779-188x250.jpg",
		},
	];

	games.forEach(async (game) => {
		const record = await prisma.game.create({
			data: {
				title: game.title,
				bannerUrl: game.bannerUrl,
			},
		});
    console.log(record);
	});

}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
