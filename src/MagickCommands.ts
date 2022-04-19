import { MagickInputFile,execute, MagickOutputFile } from "wasm-imagemagick";
import { formatBytes } from "./util";

/**
 * Runs identify {input files}
 * @param inputFiles 
 * @returns  width, height, size, error
 */
export async function Identify(inputFiles:MagickInputFile[]): Promise<{ type?:string, width?:number, height?:number, size_text?:string, error:boolean}>{
    
    const { stdout, stderr, exitCode } = await execute({
        inputFiles, 
        commands: `identify `+ inputFiles[0].name
    })
    if(exitCode === 0){
        const parts = stdout[0].split(' ');
        const type = parts[1];
        const dimensions = parts[2];
        const width = parseInt(dimensions.split('x')[0]);
        const height = parseInt(dimensions.split('x')[1]);
        const size_text = formatBytes(parseInt(parts[6]));
        const result = { type, width, height, size_text, error:false}
        console.log(result);
        return  result;
    }else{
        console.error(stderr);
        return {error:true};
    } 
}

export async function ToJPG(inputFiles:MagickInputFile[], options?:{ quality?:number, newWidth?:number, newHeight?:number, crop?:{x:number, y:number, w:number, h:number}}):Promise<MagickOutputFile[]> {
    const { stderr, exitCode, outputFiles } = await execute({
        inputFiles, 
        commands: `convert `+ inputFiles[0].name + ' ' + inputFiles[0].name.split('.')[0] + '.jpg'
    });

    if (exitCode == 0){
        return outputFiles;
    }else{
        console.error('Failed To JPG Conversion')
        console.error(stderr);
        return [];
    }
}


export async function ToPNG(inputFiles:MagickInputFile[], options?:{ quality?:number, alpha?:boolean,  newWidth?:number, newHeight?:number, crop?:{x:number, y:number, w:number, h:number}}):Promise<MagickOutputFile[]> {
    const { stderr, exitCode, outputFiles } = await execute({
        inputFiles, 
        commands: `convert `+ inputFiles[0].name + ' ' + inputFiles[0].name.split('.')[0] + '.png'
    });

    if (exitCode == 0){
        return outputFiles;
    }else{
        console.error('Failed To PNG Conversion')
        console.error(stderr);
        return [];
    }
}

export async function ToWEBP(inputFiles:MagickInputFile[], options?:{ quality?:number, alpha?:boolean,  newWidth?:number, newHeight?:number, crop?:{x:number, y:number, w:number, h:number}}):Promise<MagickOutputFile[]> {
    const { stderr, exitCode, outputFiles } = await execute({
        inputFiles, 
        commands: `magick `+ inputFiles[0].name + ' ' + inputFiles[0].name.split('.')[0] + '.webp'
    });

    if (exitCode == 0){
        return outputFiles;
    }else{
        console.error('Failed To WEBP Conversion')
        console.error(stderr);
        return [];
    }
}