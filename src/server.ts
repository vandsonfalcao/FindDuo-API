import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import convertHourStringToMinutes from "./utils/convert-hour-string-to-minutes";
import convertMinutesToHourString from "./utils/convert-minutes-to-hour-string";

const app = express();

app.use(express.json());
app.use(
	cors()
	// cors({
	// 	origin: process.env.CORS_ORIGIN,
	// })
);

const prisma = new PrismaClient();

app.get("/games", async (req, res) => {
	const games = await prisma.game.findMany({
		select: {
			uuid: true,
			title: true,
			bannerUrl: true,
			_count: {
				select: {
					ads: true,
				},
			},
		},
	});

	return res.json(games);
});

app.post("/game/:uuid/ads", async (req, res) => {
	const uuid = req.params.uuid;
	const { name, yearsPlaying, discord, weekDays, hourStart, hourEnd, useVoiceChannel } = req.body;

	const game = await prisma.game.findFirst({
		where: {
			uuid,
		},
	});

	if (!game) {
		return res.status(400).json("Game not Found");
	}

	const ad = await prisma.ad.findFirst({
		where: {
			discord,
			gameId: game.id,
		},
	});

	if (ad) {
		return res.status(400).json("Ad Aready Exist");
	}

	const newAd = await prisma.ad.create({
		data: {
			gameId: game?.id,
			name,
			yearsPlaying,
			discord,
			weekDays: weekDays.join(","),
			hourStart: convertHourStringToMinutes(hourStart),
			hourEnd: convertHourStringToMinutes(hourEnd),
			useVoiceChannel,
		},
	});

	return res
		.status(201)
		.json({ ...newAd, id: undefined, gameId: undefined, gameUuid: game.uuid });
});

app.post("/verifyIfDiscordExistInGame/:uuid", async (req, res) => {
	const uuid = req.params.uuid;
	const { discord } = req.body;

	const game = await prisma.game.findFirst({
		where: {
			uuid,
		},
	});

	if (!game) {
		return res.status(400).json("Game not Found");
	}

	const ad = await prisma.ad.findFirst({
		where: {
			discord,
			gameId: game.id,
		},
	});

	return res.status(200).json(ad ? true : false);
});

app.get("/game/:uuid/ads", async (req, res) => {
	const gameUuid = req.params.uuid;

	const game = await prisma.game.findFirst({
		select: {
			id: true,
		},
		where: {
			uuid: gameUuid,
		},
	});

	const ads = await prisma.ad.findMany({
		select: {
			uuid: true,
			name: true,
			weekDays: true,
			useVoiceChannel: true,
			yearsPlaying: true,
			hourStart: true,
			hourEnd: true,
		},
		where: {
			gameId: game?.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return res.json(
		ads.map((ad) => {
			return {
				...ad,
				weekDays: ad.weekDays.split(","),
				hourStart: convertMinutesToHourString(ad.hourStart),
				hourEnd: convertMinutesToHourString(ad.hourEnd),
			};
		})
	);
});

app.get("/ad/:uuid/discord", async (req, res) => {
	const uuid = req.params.uuid;

	const ad = await prisma.ad.findFirstOrThrow({
		select: {
			discord: true,
		},
		where: {
			uuid,
		},
	});

	return res.json({
		discord: ad.discord,
	});
});

app.listen(3333);
