/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const FarmBrand = lazy(() => import("../../pages/FarmBrand/FarmBrand"));
const AnimalPhotoVideo = lazy(
  () => import("../../pages/AnimalPhotoVideo/AnimalPhotoVideo"),
);
const SocialMedia = lazy(() => import("../../pages/SocialMedia/SocialMedia"));
const SaleListings = lazy(
  () => import("../../pages/SaleListings/SaleListings"),
);
const BreedingStockPricing = lazy(
  () => import("../../pages/BreedingStockPricing/BreedingStockPricing"),
);
const ReviewsReputation = lazy(
  () => import("../../pages/ReviewsReputation/ReviewsReputation"),
);
const AfterSaleSupport = lazy(
  () => import("../../pages/AfterSaleSupport/AfterSaleSupport"),
);

export const promotionRoutes = (
  <>
    <Route path="/farm-brand" element={<FarmBrand />} />
    <Route path="/animal-photo-video" element={<AnimalPhotoVideo />} />
    <Route path="/social-media" element={<SocialMedia />} />
    <Route path="/sale-listings" element={<SaleListings />} />
    <Route path="/breeding-stock-pricing" element={<BreedingStockPricing />} />
    <Route path="/reviews-reputation" element={<ReviewsReputation />} />
    <Route path="/after-sale-support" element={<AfterSaleSupport />} />
  </>
);
