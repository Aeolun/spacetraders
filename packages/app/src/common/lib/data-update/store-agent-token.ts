import {Agent} from "spacetraders-sdk";
import {prisma} from "@common/prisma";
import jwtDecode from "jwt-decode";

export async function storeAgentToken(
  accountEmail: string,
  agent: Agent,
  token: string
) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      email: accountEmail,
    },
  });

  const tokenData: { reset_date: string } = jwtDecode(token);

  try {
    await prisma.agent.create({
      data: {
        symbol: agent.symbol,
        reset: tokenData.reset_date,
        credits: agent.credits,
        headquartersSymbol: agent.headquarters,
        Account: {
          connect: {
            id: account.id,
          },
        },
        token: token,
      },
    });
    console.log("Inserted into agent table with", {
      symbol: agent.symbol,
      reset: tokenData.reset_date,
    });
  } catch (error) {
    console.log("Probably already exists", error);
  }
  await prisma.server.update({
    where: {
      apiUrl: process.env.API_ENDPOINT,
    },
    data: {
      resetDate: tokenData.reset_date,
    },
  });
}