-- update jumpgate information
UPDATE System s SET hasJumpGate = IF((SELECT true FROM Waypoint WHERE Waypoint.systemSymbol = s.symbol AND Waypoint.type = 'JUMP_GATE'), true, false);
UPDATE `System` s SET s.waypointsRetrieved = false;

SET @X = 7000;
SET @Y = 7000;
SET @Dis = 5000;
SET @Money = 23660000;
SET @CargoSpace = 180;

-- best trade in area
select
	s1.symbol buySystem,
	m1.waypointSymbol as buyAt,
	m1.supply as buySupply,
	gatewp1.symbol as buyGate,
	s2.symbol sellSystem,
	m2.waypointSymbol as sellAt,
	gatewp2.symbol as sellGate,
	m2.supply as sellSupply,
	m1.tradeVolume as buyVolume,
	m2.tradeVolume as sellVolume,
	ROUND(LEAST(@CargoSpace,
	    @Money / m1.purchasePrice,
	    m1.tradeVolume, m2.tradeVolume)) as tradeVolume,
	ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) as dis,
	ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2))) as disSys,
	jd.totalDistance jumpDistance,
	m1.tradeGoodSymbol,
	m1.purchasePrice,
	m2.sellPrice,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) totalProfit,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) / ROUND(jd.totalDistance/1000+40) creditsPerSecond,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice))/ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2)))  as totalPerRunDistance,
	LEAST(m1.updatedOn, m2.updatedOn) as since
from
	MarketPrice as m1
join MarketPrice as m2 on
	m1.tradeGoodSymbol = m2.tradeGoodSymbol
	and m1.waypointSymbol != m2.waypointSymbol
join Waypoint as wp1 on
	m1.waypointSymbol = wp1.symbol
join Waypoint as wp2 on
	m2.waypointSymbol = wp2.symbol
join `System` as s1 on
	wp1.systemSymbol = s1.symbol
join `System` as s2 on
	wp2.systemSymbol = s2.symbol
join Waypoint gatewp1 on gatewp1.type = 'JUMP_GATE' and gatewp1.systemSymbol = s1.symbol 
join Waypoint gatewp2 on gatewp2.type = 'JUMP_GATE' and gatewp2.systemSymbol = s2.symbol 
join JumpDistance jd on jd.fromSystemSymbol = s1.symbol and jd.toSystemSymbol =s2.symbol 
where
	m1.purchasePrice < m2.sellPrice
	and s1.x > @X-@Dis and s1.x < @X+@Dis
    and s1.y > @Y-@Dis and s1.y < @Y+@Dis
    and s2.x > @X-@Dis and s2.x < @X+@Dis
    and s2.y > @Y-@Dis and s2.y < @Y+@Dis
	and ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) > 1000
	and LEAST(m1.updatedOn, m2.updatedOn) > NOW() - INTERVAL 4 HOUR
order by
	totalPerRunDistance desc;

-- find decent place to sell stuff
select 
	mp.waypointSymbol,
	mp.sellPrice,
	wp.systemSymbol,
	jd.totalDistance,
	mp.sellPrice - (jd.totalDistance*0.8) priceToDistance
from
	MarketPrice mp
inner join Waypoint wp on
	wp.symbol = mp.waypointSymbol
inner join `System` s on
	s.symbol = wp.systemSymbol
inner join JumpDistance jd on
    jd.fromSystemSymbol = 'X1-ZT10' and jd.toSystemSymbol = s.symbol 
where
	mp.tradeGoodSymbol = 'ENGINE_ION_DRIVE_II'
	and s.hasJumpGate = true
	and mp.updatedOn > NOW() - INTERVAL 2 HOUR
order by
	priceToDistance desc
limit 10

-- best trade anywhere
select
	s1.symbol buySystem,
	m1.waypointSymbol as buyAt,
	m1.supply as buySupply,
	gatewp1.symbol as buyGate,
	s2.symbol sellSystem,
	m2.waypointSymbol as sellAt,
	gatewp2.symbol as sellGate,
	m2.supply as sellSupply,
	m1.tradeVolume as buyVolume,
	m2.tradeVolume as sellVolume,
	ROUND(LEAST(@CargoSpace,
	    @Money / m1.purchasePrice,
	    m1.tradeVolume, m2.tradeVolume)) as tradeVolume,
	ROUND(SQRT(POW(ABS(wp1.x - wp2.x), 2) + POW(ABS(wp1.y - wp2.y), 2))) as dis,
	ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2))) as disSys,
	jd.totalDistance jumpDistance,
	jd2.totalDistance distanceToStart,
	m1.tradeGoodSymbol,
	m1.purchasePrice,
	m2.sellPrice,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) totalProfit,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) / ROUND((GREATEST(jd.totalDistance+jd2.totalDistance, 0))/10+60) creditsPerSecond,
	ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice))/ROUND(SQRT(POW(ABS(s1.x - s2.x), 2) + POW(ABS(s1.y - s2.y), 2)))  as totalPerRunDistance,
	LEAST(m1.updatedOn, m2.updatedOn) as since
from
	MarketPrice as m1
join MarketPrice as m2 on
	m1.tradeGoodSymbol = m2.tradeGoodSymbol
	and m1.waypointSymbol != m2.waypointSymbol
join Waypoint as wp1 on
	m1.waypointSymbol = wp1.symbol
join Waypoint as wp2 on
	m2.waypointSymbol = wp2.symbol
join `System` as s1 on
	wp1.systemSymbol = s1.symbol
join `System` as s2 on
	wp2.systemSymbol = s2.symbol
join Waypoint gatewp1 on gatewp1.type = 'JUMP_GATE' and gatewp1.systemSymbol = s1.symbol 
join Waypoint gatewp2 on gatewp2.type = 'JUMP_GATE' and gatewp2.systemSymbol = s2.symbol 
left join JumpDistance jd on jd.fromSystemSymbol = s1.symbol and jd.toSystemSymbol =s2.symbol
left join JumpDistance jd2 on jd2.fromSystemSymbol = 'X1-GX61' and jd2.toSystemSymbol = s1.symbol
where
	m1.purchasePrice < m2.sellPrice
	and ROUND(LEAST(@CargoSpace, @Money / m1.purchasePrice, m1.tradeVolume, m2.tradeVolume) * (m2.sellPrice - m1.purchasePrice)) > 1
	and LEAST(m1.updatedOn, m2.updatedOn) > NOW() - INTERVAL 8 HOUR
order by
	creditsPerSecond desc, totalPerRunDistance desc;

update `System` set waypointsRetrieved = 0;

delete w from Waypoint w inner join `_WaypointToWaypointTrait` wtwt on wtwt.A = w.symbol and wtwt.B = 'UNCHARTED' where chartSubmittedBy IS NOT NULL;


/* find unexplored systems */
SELECT
	s.symbol,
	SQRT(POW(s.x - 7700,2) + POW(s.y - 7700,2)) as distance,
	COUNT(wp.symbol) waypointCount
FROM
	Waypoint wp
INNER JOIN `System` s ON
	wp.systemSymbol = s.symbol
WHERE
	s.x > 6700
	and s.x < 8700
	and s.y > 6700
	and s.y < 8700
    and wp.chartSubmittedBy IS NULL
GROUP BY
	wp.systemSymbol
ORDER BY distance ASC;

SELECT * FROM `_WaypointToWaypointTrait` wtwt INNER JOIN `_WaypointToWaypointTrait` wtwt2 ON wtwt.A =wtwt2.A WHERE wtwt.B = 'MARKETPLACE' AND wtwt2.B = 'COMMON_METAL_DEPOSITS';

-- find systems with not updated market info
SELECT s.symbol,
wp.symbol,
                       MIN(mp.updatedOn) lastUpdated,
                       AVG(mp.purchasePrice) avgPrice,
                       MAX(SQRT(POW(s.x - 5000, 2) + POW(s.y - 5000, 2))) as distance,
                       COUNT(wp.symbol) waypointCount
                FROM Waypoint wp
                    INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'MARKETPLACE'
                         INNER JOIN `System` s ON
                            wp.systemSymbol = s.symbol
                    LEFT JOIN MarketPrice mp ON wp.symbol = mp.waypointSymbol
                WHERE
                    s.hasJumpGate = true
                    and (s.x between -20000 and 20000)
                    and (s.y between -20000 and 20000)
                GROUP BY s.symbol, wp.symbol
                ORDER BY waypointCount DESC, distance ASC LIMIT 1000;

/* find outdated market waypoints */
SELECT
	s.symbol,
	MIN(mp.updatedOn) lastUpdated,
	ROUND(SQRT(POW(s.x - 7700,2) + POW(s.y - 7700,2))) as distance,
	COUNT(DISTINCT wp.symbol) waypointCount
FROM
	Waypoint wp
	INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'MARKETPLACE'
INNER JOIN `System` s ON
	wp.systemSymbol = s.symbol
	LEFT JOIN MarketPrice mp ON wp.symbol = mp.waypointSymbol 
WHERE
	s.hasJumpGate = true
    and	s.x > 5700
	and s.x < 9700
	and s.y > 5700
	and s.y < 9700
GROUP BY
	wp.systemSymbol
HAVING
	MIN(mp.updatedOn) < NOW() - INTERVAL 3 HOUR
ORDER BY lastUpdated, distance ASC;

select COUNT(DISTINCT wp.systemSymbol) from MarketPrice mp inner join Waypoint wp on wp.symbol = mp.waypointSymbol

SELECT COUNT(DISTINCT w.symbol) FROM Waypoint w INNER JOIN `_WaypointToWaypointTrait` wtwt ON w.symbol = wtwt.A  WHERE wtwt.B = 'MARKETPLACE';


-- find closest system to find new market info for
SELECT s.symbol,
                       MIN(mp.updatedOn) lastUpdated,
                       MAX(SQRT(POW(s.x - 7000, 2) + POW(s.y - -7000, 2))) as distance,
                       COUNT(wp.symbol) waypointCount
                FROM Waypoint wp
                    INNER JOIN _WaypointToWaypointTrait wpwp ON wpwp.A = wp.symbol AND wpwp.B = 'MARKETPLACE'
                         INNER JOIN `System` s ON
                            wp.systemSymbol = s.symbol
                    LEFT JOIN MarketPrice mp ON wp.symbol = mp.waypointSymbol
                WHERE
                    s.hasJumpGate = true
                GROUP BY s.symbol
                HAVING MIN(mp.updatedOn) IS NULL
                ORDER BY waypointCount DESC, distance ASC
                LIMIT 50
                
                

/* Closest system with unmapped warp connections */
SELECT s.symbol,
                           MAX(SQRT(POW(s.x - 5635, 2) + POW(s.y - 8832, 2))) as distance,
                           COUNT(cnt.distance) connectedSystemCount
                    FROM Waypoint wp
                             LEFT JOIN JumpConnectedSystem cnt ON cnt.fromWaypointSymbol = wp.symbol
                             INNER JOIN `System` s ON
                        wp.systemSymbol = s.symbol
                        WHERE s.hasJumpGate = true
                    GROUP BY s.symbol
                    HAVING connectedSystemCount = 0
                    ORDER BY connectedSystemCount ASC, distance ASC LIMIT 50;
                    
                   delete from JumpDistance;
                   
                  update `System` s set majorityFaction = (select w.factionSymbol from Waypoint w where w.systemSymbol = s.symbol and w.factionSymbol IS NOT NULL LIMIT 1);
                 
-- trades between systems 
SELECT mp.waypointSymbol purchaseWaypoint, mp.tradeGoodSymbol, mp.purchasePrice, mp2.waypointSymbol sellWaypoint, mp2.sellPrice, mp.tradeVolume buyVolume, mp2.tradeVolume sellVolume, (mp2.sellPrice-mp.purchasePrice)*LEAST(mp.tradeVolume, mp2.tradeVolume) totalProfit  FROM MarketPrice mp INNER JOIN MarketPrice mp2 ON mp.tradeGoodSymbol = mp2.tradeGoodSymbol INNER JOIN Waypoint w ON mp.waypointSymbol = w.symbol INNER JOIN Waypoint w2 ON mp2.waypointSymbol = w2.symbol  WHERE w.systemSymbol = 'X1-VS75' AND w2.systemSymbol = 'X1-BX42' AND mp.purchasePrice < mp2.sellPrice ORDER BY totalProfit DESC;
SELECT * FROM MarketPrice mp3 INNER JOIN Waypoint w ON mp3.waypointSymbol  =w.symbol WHERE w.systemSymbol IN("X1-SU69","X1-SF83","X1-VP2","X1-TA3","X1-PD39","X1-VK76","X1-VS75","X1-VK76","X1-PD39","X1-TA3","X1-H70","X1-DM91","X1-MG91","X1-BX42")

-- profit per ship
SELECT 
tl.shipSymbol, SUM(tl.sellAmount * tl.sellPrice) - SUM(tl.purchaseAmount * tl.purchasePrice) profit, (SUM(tl.sellAmount * tl.sellPrice) - SUM(tl.purchaseAmount * tl.purchasePrice)) / (3600*8) profitPerSecond, COUNT(distinct tl.id) transactions
FROM TradeLog tl
WHERE tl.createdAt > NOW() - INTERVAL 8 HOUR GROUP BY tl.shipSymbol 
                  