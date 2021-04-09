"use strict";
((cfg) => {
    if (typeof cfg !== 'object') {
        UI.InfoMessage('Ungültige Konfiguration!', 5000, 'error');
        return;
    }
    if (typeof TWMap !== 'object') {
        UI.InfoMessage('Das Skript funktioniert nur auf Seiten, auf denen eine Karte sichtbar ist', 5000, 'error');
        return;
    }

    if (! window.gbOriginalSpawnSector)
        window.gbOriginalSpawnSector = TWMap.mapHandler.spawnSector;

    if (! window.gbOriginalMinimapLoadSector)
        window.gbOriginalMinimapLoadSector = TWMap.minimapHandler.loadSector;

    const originalSpawnSector = (cfg.overrideMode === 'piggyback') ? TWMap.mapHandler.spawnSector : window.gbOriginalSpawnSector;
    const originalMinimapLoadSector = (cfg.overrideMode === 'piggyback') ? TWMap.minimapHandler.loadSector : window.gbOriginalMinimapLoadSector;

    let borderLines = (!Array.isArray(cfg.borders)) ? [] :
        cfg.borders
            .filter(b => Array.isArray(b.start) || b.start.length === 2 || typeof b.dir === 'string' || typeof b.length === 'number' || b.length !== 0)
            .map(b => {
                if (b.dir == 'X')
                {
                    if (b.length > 0)
                        return {
                            sx: b.start[0],
                            sy: b.start[1],
                            ex: b.start[0] + b.length,
                            ey: b.start[1],
                            dir: 'X',
                            cap: b.cap || 'round',
                            color: b.color || 'red',
                            width: b.width || 5,
                            minimapWidth: b.minimapWidth || 1,
                        };
                   else
                        return {
                            sx: b.start[0] + b.length,
                            sy: b.start[1],
                            ex: b.start[0],
                            ey: b.start[1],
                            dir: 'X',
                            cap: b.cap || 'round',
                            color: b.color || 'red',
                            width: b.width || 5,
                            minimapWidth: b.minimapWidth || 1,
                        };
                }
                else if (b.dir == 'Y')
                {
                    if (b.length > 0)
                        return {
                            sx: b.start[0],
                            sy: b.start[1],
                            ex: b.start[0],
                            ey: b.start[1] + b.length,
                            dir: 'Y',
                            cap: b.cap || 'round',
                            color: b.color || 'red',
                            width: b.width || 5,
                            minimapWidth: b.minimapWidth || 1,
                        };
                   else
                        return {
                            sx: b.start[0],
                            sy: b.start[1],
                            ex: b.start[0],
                            ey: b.start[1] + b.length,
                            dir: 'Y',
                            cap: b.cap || 'round',
                            color: b.color || 'red',
                            width: b.width || 5,
                            minimapWidth: b.minimapWidth || 1,
                        };
                }
                else if (Array.isArray(b.end) && b.end.length == 2)
                {
                        return {
                            sx: b.start[0],
                            sy: b.start[1],
                            ex: b.end[0],
                            ey: b.end[1],
                            dir: 'U',
                            cap: b.cap || 'round',
                            color: b.color || 'red',
                            width: b.width || 5,
                            minimapWidth: b.minimapWidth || 1,
                        };
                }
                else
                {
                    console.info('Invalid border direction', b.dir)
                }
            });

    TWMap.minimapHandler.loadSector = function(a) {
        originalMinimapLoadSector.apply(TWMap.minimapHandler, [a]);

        const map = a._map;
        const canvas = document.createElement("canvas");

        canvas.width = map.scale[0] * map.sectorSize;
        canvas.height = map.scale[1] * map.sectorSize;
        canvas.style.position = "absolute";
        canvas.style.zIndex = "10";

        a.appendElement(canvas, 0, 0);

        const context = canvas.getContext('2d');
        if (context)
        {
            const sector = {
                sx: a.x,
                ex: a.x + map.sectorSize,
                sy: a.y,
                ey: a.y + map.sectorSize,
            };

            for (const border of borderLines)
            {
                context.strokeStyle = border.color;
                context.lineWidth = border.minimapWidth;
                context.lineCap = border.cap;

                context.beginPath();
                context.moveTo((border.sx - sector.sx)*map.scale[0], (border.sy - sector.sy)*map.scale[1]);
                context.lineTo((border.ex - sector.sx)*map.scale[0], (border.ey - sector.sy)*map.scale[1]);
                context.stroke();
            }
        }
    }

    TWMap.mapHandler.spawnSector = function(e, a) {
        originalSpawnSector.apply(TWMap.mapHandler, [e, a]);

        const find_canvas = (a) => {
            let canvas = a._elements ? a._elements.find(e => e instanceof HTMLCanvasElement && (e.id || '').startsWith('map_canvas')) : null;
            if (! canvas)
            {
                const cavas_id = "map_canvas_" + a.x + "_" + a.y;
                canvas = document.getElementById(cavas_id);
            }
            if (! canvas)
            {
                a.spawn();
                const cavas_id = "map_canvas_" + a.x + "_" + a.y;
                canvas = document.getElementById(cavas_id);
            }
            return canvas;
        }

        let canvas = find_canvas(a);
        if (! canvas)
        {
            MapCanvas.createCanvas(a, e);
            canvas = find_canvas(a);
        }

        if (!canvas)
        {
            console.log("Canvas konnte nicht gefunden werden!");
            return;
        }

        const context = canvas.getContext('2d');
        const map = a._map;
        if (context)
        {
            const sectorBorderLines = [
                { sx: a.x, sy: a.y, ex: a.x + map.sectorSize, ey: a.y},
                { sx: a.x + map.sectorSize, sy: a.y, ex: a.x + map.sectorSize, ey: a.y + map.sectorSize},
                { sx: a.x + map.sectorSize, sy: a.y + map.sectorSize, ex: a.x, ey: a.x + map.sectorSize},
                { sx: a.x, sy: a.x + map.sectorSize, ex: a.x, ey: a.y},
            ];
            const sector = {
                sx: a.x,
                ex: a.x + map.sectorSize,
                sy: a.y,
                ey: a.y + map.sectorSize,
            };

            for (const border of borderLines)
            {
                context.strokeStyle = border.color;
                context.lineWidth = border.width;
                context.lineCap = border.cap;

                context.beginPath();
                context.moveTo((border.sx - sector.sx)*map.scale[0], (border.sy - sector.sy)*map.scale[1]);
                context.lineTo((border.ex - sector.sx)*map.scale[0], (border.ey - sector.sy)*map.scale[1]);
                context.stroke();
            }
        }
        else
        {
            console.log('Kontext konnte nicht angelegt werden!');
        }
    }
    TWMap.reload();
})(gbBordersConfig);