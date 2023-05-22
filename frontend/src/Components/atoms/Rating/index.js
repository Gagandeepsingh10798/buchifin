import { RatingStar } from "rating-star";

function Rating({size,rating,colors}){
    console.log(rating)
    return(
        <RatingStar
        size={size}
        rating={rating}
        colors={colors}
        />
    )
}

export default Rating;