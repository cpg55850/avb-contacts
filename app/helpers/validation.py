from typing import Iterable, Dict, Any, List

def require_fields(data: Dict[str, Any], fields: Iterable[str]) -> List[str]:
    return [f for f in fields if not data.get(f)]