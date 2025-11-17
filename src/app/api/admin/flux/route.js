import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request) {
  try {
    const { action, auctionId, playerIds, focusPlayerId } = await request.json();

    if (action === 'ACTIVATE') {
        await prisma.auction.update({ where: { id: auctionId }, data: { fluxData: JSON.stringify({ state: 'ACTIVE' }) } });
        return NextResponse.json({ success: true });
    }

    if (action === 'FOCUS') {
        const player = await prisma.player.findUnique({ where: { id: focusPlayerId } });
        await prisma.auction.update({ where: { id: auctionId }, data: { fluxData: JSON.stringify({ state: 'FOCUS', player: { name: player.name, image: player.image } }) } });
        return NextResponse.json({ success: true });
    }

    if (action === 'START_ANIMATION') {
        await prisma.auction.update({ where: { id: auctionId }, data: { fluxData: JSON.stringify({ state: 'ANIMATING' }) } });
        return NextResponse.json({ success: true });
    }

    // --- MAIN EXECUTION LOGIC ---
    if (action === 'EXECUTE') {
        const players = await prisma.player.findMany({ where: { id: { in: playerIds } } });
        const teams = await prisma.team.findMany({ where: { auctionId } });

        const shuffledTeams = teams.sort(() => 0.5 - Math.random());
        const shuffledPlayers = players.sort(() => 0.5 - Math.random());

        const assignments = [];
        const dbOperations = [];

        for (let i = 0; i < shuffledPlayers.length; i++) {
            if (i >= shuffledTeams.length) break;
            const p = shuffledPlayers[i];
            const t = shuffledTeams[i];

            // 1. Assign Player to Team (RECORD SOLD PRICE BUT DO NOT DEDUCT FROM PURSE)
            dbOperations.push(prisma.player.update({
                where: { id: p.id },
                data: { isSold: true, soldPrice: p.basePrice, teamId: t.id }
            }));
            
            // --- REMOVED: PURSE DEDUCTION LOGIC ---
            // Money is NOT deducted for Flux players as per request
            
            assignments.push({
                playerId: p.id,
                playerName: p.name,
                playerImage: p.image,
                teamName: t.name,
                teamColor: t.themeColor || '#E62E2E'
            });
        }

        await prisma.$transaction(dbOperations);

        // 2. Move sold players to bottom of the auction list
        const lastPlayer = await prisma.player.findFirst({ where: { auctionId }, orderBy: { order: 'desc' } });
        let startOrder = (lastPlayer?.order || 0) + 1;
        
        for(let i=0; i<shuffledPlayers.length; i++){
            await prisma.player.update({ where: { id: shuffledPlayers[i].id }, data: { order: startOrder + i } });
        }

        // 3. Auto-Select NEXT Unsold Player for the main screen
        const nextActive = await prisma.player.findFirst({
            where: { auctionId, isSold: false },
            orderBy: { order: 'asc' }
        });

        // 4. Update Auction State (Reveal Flux)
        await prisma.auction.update({
            where: { id: auctionId },
            data: { 
                activePlayerId: nextActive ? nextActive.id : null,
                currentBid: 0,
                currentBidderId: null,
                fluxData: JSON.stringify({ state: 'REVEAL', matches: assignments }) 
            }
        });

        return NextResponse.json({ success: true, count: assignments.length });
    }

    if (action === 'RESET') {
        await prisma.auction.update({ where: { id: auctionId }, data: { fluxData: JSON.stringify({ state: 'IDLE' }) } });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}