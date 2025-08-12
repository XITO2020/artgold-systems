import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';

const DISCORD_API_URL = 'https://discord.com/api/v10';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const guildId = searchParams.get('guildId');
    const roleId = searchParams.get('roleId');

    if (!guildId || !roleId) {
      return NextResponse.json(
        { error: 'Missing guildId or roleId' },
        { status: 400 }
      );
    }

    // Get user's Discord account
    const discordAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'discord',
      },
    });

    if (!discordAccount?.access_token) {
      return NextResponse.json(
        { error: 'No linked Discord account' },
        { status: 404 }
      );
    }

    // Check user's roles in the guild
    const guildMember = await fetch(
      `${DISCORD_API_URL}/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${discordAccount.access_token}`,
        },
      }
    );

    if (!guildMember.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch guild member' },
        { status: 404 }
      );
    }

    const { roles } = await guildMember.json();
    const hasRole = roles.includes(roleId);

    if (hasRole) {
      // Update user's verification status in database
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          discordVerified: true,
          discordRoles: {
            push: roleId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Role verified successfully',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'User does not have the required role',
    });
  } catch (error) {
    console.error('Role verification error:', error);
    return NextResponse.json(
      { error: 'Role verification failed' },
      { status: 500 }
    );
  }
}