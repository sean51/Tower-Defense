#pragma strict

public static class Functions
{
	public function Closest_Tag(object_tag : String, object_position : Vector3, max_range : float) : GameObject
	{
		var range : float = 3.0f;
		var saved_enemy : GameObject = null;
		var saved_distance : float = -1.0f;
		for (var error_threshold : int = 0; error_threshold < 10; error_threshold++)
		{
			for (var hit_collider : Collider in Physics.OverlapSphere(object_position, range))
			{
				if(hit_collider.gameObject.tag == object_tag)
				{
					var new_distance : float = Vector3.Distance(object_position, hit_collider.gameObject.transform.position);
					if (saved_distance < 0 || new_distance < saved_distance)
					{
						saved_distance = new_distance;
						saved_enemy = hit_collider.gameObject;
					}
				}
			}
			range *= 2;
			if (saved_enemy != null)
			{
				return saved_enemy;
			}
			else if (range >= max_range)
			{
				range = max_range;
				error_threshold = 8;
			}
		}
		return null;
	}

}