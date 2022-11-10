const info = {
    months: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
    shortMonths: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
    weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
}
export default function formatDate(date: Date, format?: string){
    const addZero = (str: any) => ("0" + str).slice(-2);
    
    function isToday(date: Date): boolean {
        return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
    }
    function isYesterday(date: Date): boolean {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
    }
    function replaceDate(date: Date, format_expected: string): string{
        // Replace occurence of Years
        format_expected = format_expected.replaceAll("YYYY", date.getFullYear().toString()); // 2021 / 2022
        format_expected = format_expected.replaceAll("YY", date.getFullYear().toString()); // 21 / 22
        
        // Replace occurence of Months
        format_expected = format_expected.replaceAll("MMMM", info.months[ date.getMonth() ]); // Janeiro / Fevereiro / Março
        format_expected = format_expected.replaceAll("MMM", info.shortMonths[ date.getMonth() ]); // Jan / Fev / Mar
        format_expected = format_expected.replaceAll("MM", addZero(date.getMonth() + 1)); // 1 / 2 / 3
        
        // Replace occurence of Days
        format_expected = format_expected.replaceAll("DD", addZero(date.getDate())); // 09 / 10 / 11
        format_expected = format_expected.replaceAll("DAY", info.weekdays[ date.getDate() ]); // Segunda / Terça / Quarta
        
        // Replace occurence of Hours
        format_expected = format_expected.replaceAll("HH", addZero(date.getHours())); // 00 / 01 / 02 / 03
        
        // Replace occurence of Minutes
        format_expected = format_expected.replaceAll("mm", addZero(date.getMinutes())); // 00 / 01 / 02 / 03
        
        // Replace occurence of Seconds
        format_expected = format_expected.replaceAll("ss", addZero(date.getSeconds())); // 00 / 01 / 02 / 03
        
        // Replace occurence of MiliSeconds
        format_expected = format_expected.replaceAll("ms", addZero(date.getMilliseconds())); // 00 / 01 / 02 / 03
        
        return format_expected;
    }
    function date_to_string(date: Date, format?: string): string {
        if(format){ return replaceDate(date, format); }
        
        const formated_hour = replaceDate(date, "HH:mm:ss");
        if (isToday(date)) { return `Hoje às ${formated_hour}`; }
        if (isYesterday(date)) { return `Ontem às ${formated_hour}`; }
        
        return `${replaceDate(date, "DD/MM/YYYY")} às ${formated_hour}`;
    }
    
    return date_to_string(date, format);
}