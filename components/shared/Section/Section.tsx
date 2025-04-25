import {Exhibitions} from '@/components/shared/Exhibition/Exhibition'


export const Section = () => {
    return (
        <div className="flex flex-col items-center gap-5">
            <Exhibitions/>
            <Exhibitions/>
            <Exhibitions/>
        </div>
    )
}