#pragma strict

public static class Functions
{
	public function Find_Waypoint(object_position : Vector3) : GameObject
	{
		var range : float = 5.0f;
		for (var error_threshold : int = 0; error_threshold < 10; error_threshold++)
		{
			for (var hit_collider : Collider in Physics.OverlapSphere(object_position, range))
			{
				if (hit_collider.gameObject.tag == "End")
				{
					return hit_collider.gameObject;
				}
			}
			range *= 2;
		}
		return null;
	}

}