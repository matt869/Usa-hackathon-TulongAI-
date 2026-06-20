import { useState, useCallback } from "react";
import { checkEligibilityFromText, checkEligibilityStructured } from "../utils/api";

export function useEligibility() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkFromText = useCallback(async (text, language = "en") => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkEligibilityFromText(text, language);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStructured = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkEligibilityStructured(formData);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, loading, error, checkFromText, checkStructured, reset };
}
