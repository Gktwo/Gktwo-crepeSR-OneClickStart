import fs from 'fs';
import { resolve } from 'path';
import { VerboseLevel } from './Logger';

type Banner = {
    gachaId: number,
    detailWebview: string,
    rateUpItems4: number[],
    rateUpItems5: number[],
    costItemId: number
}

function r(...args: string[]) {
    return fs.readFileSync(resolve(__dirname, ...args)).toString();
}

export default class Banners {
    public static config: Banner[];

    public static init(){
        Banners.readConfig();
    }

    private static readConfig(){
        let config: Banner[];
        const defaultConfig: Banner[] = [
            {
                gachaId: 1001,
                detailWebview: "",
                rateUpItems4: [
                    1001, 1103
                ],
                rateUpItems5: [
                    1102
                ],
                costItemId: -1 //unused for now
            } as Banner
        ];

        try {
            config = JSON.parse(r('../../banners.json'));
            
            for(const [index, gachaBanner] of Object.entries(config)){
                const missing = Object.keys(defaultConfig[0]).filter(key => !gachaBanner.hasOwnProperty(key));
                if (missing.length > 0) {
                    console.log(`Missing ${missing.join(', ')}, using default values. Backup of your older config: ${JSON.stringify(gachaBanner, null, 2)}`);
                    config[parseInt(index)] = defaultConfig[0];
                }
            }
            Banners.updateConfig(config);
        } catch {
            console.error("Could not read banners file. Creating one for you...");
            Banners.updateConfig(defaultConfig);
        }
    }
    
    private static updateConfig(config: Banner[]) {
        this.config = config;
        fs.writeFileSync('./banners.json', JSON.stringify(config, null, 2));
    }
}
