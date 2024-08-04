import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Coordinate,
  CreateMarkerReqBody,
  MarkerData,
} from "../model/PointOfInterest";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const createPointOfInterest = (
  marker: CreateMarkerReqBody & {
    coordinates: Coordinate[][];
  }
) => {
  return axios.post<MarkerData & { coordinates: Coordinate[][] }>(
    `/pointOfInterest`,
    {
      ...marker,
    }
  );
};

export const getAllPointOfInterests = async (filterOptions = {}) => {
  const response = await axios.get<MarkerData[]>("/pointOfInterest", {
    params: filterOptions, // Pass the filter options as query parameters
  });
  return response.data;
};
export const getAllTags = async () => {
  const response = await axios.get<string[]>("/tags");
  return response.data;
};

export const usePointOfInterests = (filterOptions = {}) => {
  const {
    isLoading,
    isError,
    data: pointOfInterests,
    refetch,
  } = useQuery(["pointOfInterests"], () =>
    getAllPointOfInterests(filterOptions)
  );
  return { isLoading, isError, pointOfInterests, refetch };
};
export const useTags = () => {
  const {
    isLoading: isLoadingTags,
    isError: isErrorTags,
    data: tags,
  } = useQuery(["tags"], () => getAllTags());
  return { isLoadingTags, isErrorTags, tags };
};

export const getPointOfInterestDetails = async (id: string) => {
  const pointOfInterest = await axios.get<MarkerData>(`/pointOfInterest/${id}`);
  return pointOfInterest.data;
};

export const editPointOfInterest = async (pointOfInterest: MarkerData) => {
  const response = await axios.put<MarkerData>(
    `/pointOfInterest/${pointOfInterest.id}`,
    pointOfInterest
  );
  return response.data;
};

export const usePointOfInterestDetails = (id: string | null) => {
  const queryClient = useQueryClient(); // This is needed to invalidate the cache
  const {
    mutate: editPoi,
    isLoading: isLoadingEdit,
    isError: isErrorEdit,
    isSuccess: isSuccessEdit,
  } = useMutation(
    (pointOfInterest: MarkerData) => editPointOfInterest(pointOfInterest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["pointOfInterest", id]);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const {
    isLoading,
    isError,
    data: pointOfInterest,
    refetch,
  } = useQuery(["pointOfInterest", id], () => getPointOfInterestDetails(id!), {
    enabled: !!id,
  });

  return {
    isLoading,
    isError,
    pointOfInterest,
    refetch,
    editPoi,
    isLoadingEdit,
    isErrorEdit,
    isSuccessEdit,
  };
};

export const deletePointOfInterest = async (id: string) => {
  const response = await axios.delete(`/pointOfInterest/${id}`);
  return { data: response.data, status: response.status };
};
