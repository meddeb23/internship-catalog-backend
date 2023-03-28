export default function formatResponse(
  status: number,
  data: Object,
  headers: Object = {}
) {
  return {
    headers,
    status,
    data: {
      ...data,
      success: true,
    },
  };
}
